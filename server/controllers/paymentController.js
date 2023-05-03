const path = require('path');

const gateway = require('../config/paymentGatewayInit');
const UserModel = require('../models/userModel');
const TagModel = require('../models/tagModel');
const PurchaseModel = require('../models/purchaseModel');

const sendReceiptEmail = require('../../server/utils/sendReceipt');
const calculateCart = require('../../server/utils/calculateCart');

const getBraintreeUI = async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'braintree.html'));
};

const createCustomer = async (req, res) => {
  const { uuid, firstName, lastName, email } = req.body;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.braintreeCustomerId) {
      return res.status(409).json({
        error: 'User is already has a saved customer client in the vault',
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
    res.status(500).json({ error: 'Server Error' });
  }
};

//TODO: will be replaced as change payment method
const getPaymentMethod = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
    res.status(500).json({ error: error.message });
  }
};

const getClientToken = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
    res.status(500).json({ error: error.message });
  }
};

const createTransaction = async (req, res) => {
  let merchantID = '';
  const { uuid, tagUuid } = req.body;
  try {
    const user = await UserModel.findOne({ uuid })
      .select('-cart._id -cart.tags')
      .populate('cart.product');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { braintreeCustomerId: customerId } = user;
    if (!customerId) {
      return res.status(409).json({
        error: `User ${uuid} does not have customer in the vault, create one with a POST request to /payment/customers`,
      });
    }

    let price = '';
    let products = [];
    //single payment
    if (tagUuid) {
      
      const tag = await TagModel.findOne({ uuid: tagUuid })
        .lean()
        .populate('attachedProduct attachedStore');

      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      //TODO: check if tag is available, add client error

      const { attachedProduct, attachedStore } = tag;
      const { price: productPrice } = attachedProduct;
      merchantID = attachedStore.merchantID;

      price = productPrice;

      const singleProduct = {
        product: attachedProduct,
        quantity: 1,
      };
      products.push(singleProduct);
    }
  
    //cart payment
    else {
      //TODO: make calculateCart calc only the isAvailable tags, the user.cart may be selected without the tags -> check it
      price = calculateCart(user.cart);
      products = user.cart;
    }
    // using default payment method
    const result = await gateway.transaction.sale({
      amount: price,
      customerId,
      merchantAccountId: merchantID,
      options: {
        submitForSettlement: true,
      },
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.message,
        client:
          'אירעה שגיאה בתהליך התשלום, יש לנסות בשנית או לחכות למועד מאוחר יותר',
      });
    }

    //delete user cart after successful purchase
    user.cart = [];

    //TODO: create createPurchase handler, gets uuid (check tokens as usual) and transactionId, the cart that he payed for
    const { transaction } = result;

    const utcTime = new Date(transaction.createdAt);
    const date = utcTime.toLocaleDateString('he-IL');
    const time = utcTime.toLocaleTimeString('he-IL');

    const { _id: purchaseID, transactionTimeStamp } =
      await PurchaseModel.create({
        transactionId: transaction.id,
        merchantID: transaction.merchantAccountId,
        cardType: transaction.creditCard.cardType,
        totalAmount: transaction.amount,
        transactionTimeStamp: { transactionDate: date, transactionTime: time },
        products,
      });

    user.purchases.push(purchaseID);
    await user.save();

    await sendReceiptEmail({
      targetEmail: user.email,
      transactionId: transaction.id,
      merchantId: transaction.merchantAccountId,
      amount: transaction.amount,
      transactionDate: transactionTimeStamp.transactionDate,
      transactionTime: transactionTimeStamp.transactionTime,
      cardType: transaction.creditCard.cardType,
      last4: transaction.creditCard.last4,
      firstName: transaction.customer.firstName,
      lastName: transaction.customer.lastName,
      email: transaction.customer.email,
      cart: products,
    });

    return res.status(200).json({ result: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  const { uuid } = req.params;
  const updatedUserInfo = req.body;

  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
    res.status(500).json({ error: error });
  }
};

const isBraintreeCustomer = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await UserModel.findOne({ uuid })
      .select('-_id braintreeCustomerId')
      .lean();

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.braintreeCustomerId)
      return res.json({
        message: 'braintreeCustomerId not found',
        isBraintreeCustomer: false,
      });
    return res.json({
      message: 'braintreeCustomerId found',
      isBraintreeCustomer: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getBraintreeUI,
  createCustomer,
  getPaymentMethod,
  getClientToken,
  createTransaction,
  updateCustomer,
  isBraintreeCustomer,
};
