const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  merchantID: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
    unique: true,
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      tags: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tag",
          required: true,
        },
      ],
    },
  ],
});

const StoreModel = mongoose.model("Store", storeSchema);

module.exports = StoreModel;
