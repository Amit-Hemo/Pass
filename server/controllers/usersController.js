const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const OtpModel = require("../models/otpModel");
const TagModel = require("../models/tagModel");
const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../utils/sendOTPEmail");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");

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

    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp });

    await sendOTPEmail({
      otp,
      otpExpire: 5,
      targetEmail: email,
      actionMessage: "לאמת את חשבונך",
    });

    res.json({
      message: "An OTP has been sent to the email for verification",
      uuid,
      firstName,
      lastName,
      email,
    });
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
      return res.status(404).json({ error: "User not found" });
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
    if (!user) return res.status(404).json({ error: "User not found" });
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res.status(401).json({ error: "Wrong password" });

    if (!user.verified) {
      return res
        .status(401)
        .json({ error: "User must be verified before login" });
    }

    const accessToken = user.generateAccessToken(user.uuid);
    const refreshToken = user.generateRefreshToken(user.uuid);

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
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
    if (!user) return res.status(401).json({ error: "User not found" });
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleRefreshToken(req, res) {
  const { refreshToken } = req.body;
  const user = await UserModel.findOne({ refreshToken });
  if (!user) return res.status(403).json({ error: "Refresh token not found" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = user.generateAccessToken(decoded.uuid);
    return res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
}

async function updatePassword(req, res) {
  const { password, newPassword } = req.body;
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res.status(400).json({ error: "Invalid password" });

    const isOriginal = await user.comparePassword(newPassword);
    if (isOriginal)
      return res.status(400).json({ error: "Password has already been used" });

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been successfully updated" });
  } catch (error) {
    return res.status(409).json({ error: "Server error" });
  }
}

async function resetPassword(req, res) {
  const { newPassword } = req.body;
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isOriginal = await user.comparePassword(newPassword);
    if (isOriginal)
      return res.status(400).json({ error: "Password has already been used" });

    user.password = newPassword;
    await user.save();

    sendResetPasswordEmail({
      targetEmail: user.email,
    });

    return res
      .status(200)
      .json({ message: "Password has been successfully reset" });
  } catch (error) {
    return res.status(409).json({ error: "Server error" });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    await OtpModel.deleteMany({ email });
    const otp = generateOTP();

    await OtpModel.create({ email, otp });

    await sendOTPEmail({
      otp,
      otpExpire: 5,
      targetEmail: email,
      actionMessage: "לשחזר את הסיסמא",
    });

    res.status(200).json({
      message: `Password reset OTP has been sent to this email: ${email}`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function validateOTP(req, res) {
  const { otp, email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otpDocument = await OtpModel.findOne({ email });
    if (!otpDocument)
      return res.status(404).json({ error: "OTP is not found for that user" });

    const isMatch = await otpDocument.compareOTP(otp);
    if (!isMatch) return res.status(400).json({ error: "Wrong OTP" });

    await otpDocument.deleteOne();
    user.verified = true;
    await user.save();

    res.json({ message: "otp is valid", uuid: user.uuid });
  } catch (error) {
    return res.status(500).json({ error: "Error in OTP verification process" });
  }
}

async function addProductToCart(req, res) {
  const { uuid: userId } = req.params;
  const { tagUuid } = req.body;

  try {
    const user = await UserModel.findOne({ uuid: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const tag = await TagModel.findOne({ uuid: tagUuid });
    if (!tag) return res.status(404).json({ error: "Tag not found" });

    const { cart } = user;
    const foundProduct = cart.find(
      (value) => value.product.toString() === tag.attachedProduct.toString()
    );

    if (foundProduct) {
      const isTagExists = foundProduct.tags.includes(tag._id);
      if (isTagExists)
        return res.status(409).json({ error: "The tag is already in cart" });
      foundProduct.quantity++;
      foundProduct.tags.push(tag._id);
    } else {
      cart.push({ product: tag.attachedProduct, quantity: 1, tags: [tag._id] });
    }

    await user.save();

    return res.json({ message: "Product has been added to the cart" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function deleteProductFromCart(req, res) {
  const { uuid, tagUuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const tag = await TagModel.findOne({ uuid: tagUuid });
    if (!tag) return res.status(404).json({ error: "Tag not found" });

    const { cart } = user;
    const foundProduct = cart.find(
      (value) => value.product.toString() === tag.attachedProduct.toString()
    );

    if (!foundProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const isTagExists = foundProduct.tags.includes(tag._id);
    if (!isTagExists)
      return res.status(404).json({ error: "Tag not found in the cart" });

    const productIndex = cart.indexOf(foundProduct);

    if (foundProduct.quantity === 1) {
      cart.splice(productIndex, 1);
    } else {
      const tagIndex = foundProduct.tags.indexOf(tag._id);
      foundProduct.tags.splice(tagIndex, 1);
      foundProduct.quantity--;
    }
    await user.save();
    return res.json({ message: "product deleted from cart" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function watchCart(req, res) {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { cart } = await user.populate("cart.product");

    const selectedItems = cart.map(({ product, quantity }) => ({
      name: product.name,
      size: product.size,
      price: product.price,
      image: product.image,
      quantity,
    }));

    return res.json({ selectedItems });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
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
  resetPassword,
  addProductToCart,
  deleteProductFromCart,
  watchCart,
};
