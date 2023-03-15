const UserModel = require('../models/userModel');

async function createUser(req, res) {
  try {
    const {firstNameInput, lastNameInput, emailInput, passwordInput} = req.body
    const {firstName, lastName, email} = await UserModel.create({firstNameInput, lastNameInput, emailInput, passwordInput});
    res.json(firstName, lastName, email)
  } catch (err) {
    console.error(err);
    res.status(409).send(err);
  }
}

module.exports = {
  createUser,
};
