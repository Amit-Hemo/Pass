const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const OtpModel = require('../models/otpModel');
const generateOTP = require('../utils/generateOTP');
const sendOTPEmail = require('../utils/sendOTPEmail');

async function createUser(req, res) {
  const {
    firstName: firstNameInput,
    lastName: lastNameInput,
    email: emailInput,
    password: passwordInput,
  } = req.body;

  try {
    const { firstName, lastName, email, uuid } = await UserModel.create({
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
    });
    res.json({ uuid, firstName, lastName, email });
  } catch (err) {
    console.error(err);
    res.status(409).send(err);
  }
}

async function updateUser(req, res) {
  const { uuid: uuidInput } = req.params;
  const updatedUserInfo = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { uuid: uuidInput },
      updatedUserInfo,
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { uuid, firstName, lastName, email } = updatedUser;

    res.json({ uuid, firstName, lastName, email });
  } catch (err) {
    return res.status(409).json({ error: err });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res.status(401).json({ error: 'Wrong password' });

    const accessToken = user.generateAccessToken(user.uuid);
    const refreshToken = user.generateRefreshToken(user.uuid);

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function logoutUser(req, res) {
  const { refreshToken } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null },
      { new: true }
    );
    if (!user) return res.status(401).json({ error: 'User not found' });
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function handleRefreshToken(req, res) {
  const { refreshToken } = req.body;
  const user = await UserModel.findOne({ refreshToken });
  if (!user) return res.status(403).json({ error: 'Refresh token not found' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = user.generateAccessToken(decoded.uuid);
    return res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
}

async function updatePassword(req, res) {
  const { password, newPassword } = req.body;
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res.status(400).json({ error: 'Invalid password' });
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(409).json({ error: 'Server error' });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp });

    await sendOTPEmail({
      otp,
      otpExpire: 5,
      targetEmail: email,
      actionMessage: 'לשחזר את הסיסמא',
    });

    res.status(200).json({
      message: `Password reset OTP has been sent to this email: ${email}`,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

async function validateOTP(req, res) {
  const { otp , email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otpDocument = await OtpModel.findOne({ email });
    if (!otpDocument)
      return res.status(404).json({ error: 'OTP is not found for that user' });

    const isMatch = await otpDocument.compareOTP(otp);
    if (!isMatch) return res.status(400).json({ error: 'Wrong OTP' });

    await otpDocument.deleteOne();

    res.json({ message: 'otp is valid' });
  } catch (error) {
    return res.status(500).json({ error: 'Error in OTP verification process' });
  }
}

module.exports = {
  createUser,
  updateUser,
  loginUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  validateOTP,
};
