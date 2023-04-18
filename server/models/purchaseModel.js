const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
    unique: true,
  },

  merchantID: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },

  cardType: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  totalAmount: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 10,
    trim: true,
    validate: {
      validator: (value) => /^\d+(\.\d{1,2})?$/.test(value),
      message: "invalid amount",
    },
  },
  transactionTimeStamp: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => !isNaN(Date.parse(value)),
      message: "invalid time/date ",
    },
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

const PurchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = PurchaseModel;
