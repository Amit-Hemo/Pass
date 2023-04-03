const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const url = require('url');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 10,
    trim: true,
    validate: {
      validator: (value) => /^\d+(\.\d{1,2})?$/.test(value),
      message: 'please fill a valid email address',
    },
  },
  size: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 5,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        try {
          const parsedUrl = new URL(value);
          return (
            parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
          );
        } catch {
          return false;
        }
      },
      message: 'Invalid image URL',
    },
  },
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
