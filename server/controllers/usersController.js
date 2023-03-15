const UserModel = require('../models/userModel');

async function createUser(req, res) {
  const {
    firstName: firstNameInput,
    lastName: lastNameInput,
    email: emailInput,
    password: passwordInput,
  } = req.body;
  try {
    const {
      firstName,
      lastName,
      email,
      _id: id,
    } = await UserModel.create({
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
    });
    res.json({ id, firstName, lastName, email });
  } catch (err) {
    console.error(err);
    res.status(409).send(err);
  }
}

module.exports = {
  createUser,
};
