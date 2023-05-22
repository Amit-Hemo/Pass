const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const TagModel = require('./tagModel');

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
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
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
      message: 'please fill a valid email address',
    },
  },
  password: {
    type: String,
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
  refreshToken: {
    type: String,
    nullable: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      tags: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tag',
          required: true,
        },
      ],
    },
  ],
  purchases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase',
    },
  ],
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

userSchema.methods.comparePassword = async function (password) {
  const isEqual = await bcrypt.compare(password, this.password);
  return isEqual;
};

userSchema.methods.disableCartTags = async function () {
  const tagIds = this.cart.flatMap(({ tags }) => tags.map((tag) => tag.uuid));
  await TagModel.updateMany({ uuid: { $in: tagIds } }, { isAvailable: false });
};

userSchema.methods.generateAccessToken = function (uuid) {
  return jwt.sign({ uuid }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

userSchema.methods.generateRefreshToken = function (uuid) {
  return jwt.sign({ uuid }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
};

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = UserModel;
