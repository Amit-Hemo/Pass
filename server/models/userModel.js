const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
      message: 'please fill a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 100,
    validate: {
      validator: (value) => {
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const digitRegex = /\d/;
        const specialCharRegex = /[!@#$%^&*]/;
        return (
          uppercaseRegex.test(value) &&
          lowercaseRegex.test(value) &&
          digitRegex.test(value) &&
          specialCharRegex.test(value)
        );
      },
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  },
  braintreeCustomerId: {
    type: String,
    minLength: 1,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
