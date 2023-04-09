const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const tagSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const TagModel = mongoose.model("Tag", tagSchema);

module.exports = TagModel;
