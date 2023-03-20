const UserModel = require("../models/userModel");

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
  const { uuidInput } = req.params;
  const updatedUserInfo = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { uuidInput },
      updatedUserInfo,
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const { uuid, firstName, lastName, email } = updatedUser;

    //TODO: create route of change password

    res.json({ uuid, firstName, lastName, email });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword)
      return res.status(401).json({ error: "Passwords do not match" });

    const accessToken = user.generateAccessToken(user.uuid);
    const refreshToken = user.generateRefreshToken(user.uuid);

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createUser,
  updateUser,
  loginUser,
};
