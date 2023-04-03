const path = require("path");

const gateway = require("../config/paymentGatewayInit");
const UserModel = require("../models/userModel");

const getBraintreeUI = async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "braintree.html"));
};

const createCustomer = async (req, res) => {
  const { uuid, firstName, lastName, email } = req.body;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.braintreeCustomerId) {
      return res.status(409).json({
        error: "User is already has a saved customer client in the vault",
      });
    }

    const createResult = await gateway.customer.create({
      firstName,
      lastName,
      email,
    });
    const customerId = createResult.customer.id;

    user.braintreeCustomerId = customerId;
    await user.save();
    res.json({
      message: `A new customer for the user: ${uuid} has been added to the vault`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentMethod = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { braintreeCustomerId: customerId } = user;
    if (!customerId) {
      return res.status(409).json({
        error: `User ${uuid} does not have customer in the vault, create one with a POST request to /payment/customers`,
      });
    }

    const customer = await gateway.customer.find(customerId);
    const firstMethod = customer.paymentMethods[0];
    res.json({ firstMethod });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientToken = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { braintreeCustomerId: customerId } = user;
    if (!customerId) {
      return res.status(409).json({
        error: `User ${uuid} does not have customer in the vault, create one with a POST request to /payment/customers`,
      });
    }

    const result = await gateway.clientToken.generate({
      customerId,
    });
    const clientToken = result.clientToken;
    res.status(200).json({ clientToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  const { uuid, merchantID, price } = req.body;
  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { braintreeCustomerId: customerId } = user;
    if (!customerId) {
      return res.status(409).json({
        error: `User ${uuid} does not have customer in the vault, create one with a POST request to /payment/customers`,
      });
    }
    // using default payment method
    const result = await gateway.transaction.sale({
      amount: price,
      customerId,
      merchantAccountId: merchantID,
      options : {
        submitForSettlement: true
      },
    });
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  const { uuid } = req.params;
  const updatedUserInfo = req.body;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { braintreeCustomerId: customerId } = user;
    if (!customerId) {
      return res.status(409).json({
        error: `User ${uuid} does not have customer in the vault, create one with a POST request to /payment/customers`,
      });
    }

    const customer = await gateway.customer.update(customerId, updatedUserInfo);

    res.json({ message: customer });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getBraintreeUI,
  createCustomer,
  getPaymentMethod,
  getClientToken,
  createTransaction,
  updateCustomer,
};
