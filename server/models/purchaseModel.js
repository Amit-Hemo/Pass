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
    transactionTime: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) =>
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value),
        message: "invalid time/date ",
      },
    },
    transactionDate: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) =>
          /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])\.(20\d{2})$/.test(
            value
          ),
        message: "invalid time/date ",
      },
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

const PurchaseModel = mongoose.models.Purchase||mongoose.model("Purchase", purchaseSchema);

module.exports = PurchaseModel;
