const express = require('express');

const paymentController = require('../controllers/paymentController');
const validateResource = require('../middlewares/validateResource');
const validateAuthUUID = require('../middlewares/validateAuthUUID');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const uuidSchema = require('../schemas/uuidSchema');
const userSchema = require('../schemas/userSchema');
const tagUuidSchema = require('../schemas/tagUuidSchema');
const transactionSchema = require('../schemas/transactionSchema');
const paymentMethodSchema = require('../schemas/paymentMethodSchema');
const httpLogger = require('../middlewares/httpLogger');

const router = express.Router();

router.use(httpLogger('payment'));

router.get('/', paymentController.getBraintreeUI);

router.use(verifyAccessToken);

router.post(
  '/customers',
  [
    validateResource({
      body: userSchema
        .pick({ firstName: true, lastName: true, email: true })
        .merge(uuidSchema),
    }),
    validateAuthUUID,
  ],
  paymentController.createCustomer
);
router.get(
  '/customers/:uuid',
  [validateResource({ params: uuidSchema }), validateAuthUUID],
  paymentController.getPaymentMethod
);
router.put(
  '/customers/:uuid',
  [
    validateResource({ params: uuidSchema, body: paymentMethodSchema }),
    validateAuthUUID,
  ],
  paymentController.changePaymentMethod
);
router.get(
  '/customers/:uuid/generateToken',
  [validateResource({ params: uuidSchema }), validateAuthUUID],
  paymentController.getClientToken
);

router.get(
  '/customers/:uuid/isBraintreeCustomer',
  [validateResource({ params: uuidSchema }), validateAuthUUID],
  paymentController.isBraintreeCustomer
);

router.post(
  '/transaction',
  [
    validateResource({
      body: uuidSchema.merge(tagUuidSchema.partial()),
    }),
    validateAuthUUID,
  ],
  paymentController.createTransaction
);

router.post(
  '/customers/:uuid/receipt',
  [
    validateResource({
      params: uuidSchema,
      body: transactionSchema,
    }),
    validateAuthUUID,
  ],
  paymentController.sendReceipt
);

router.put(
  '/customers/:uuid',
  [
    validateResource({
      body: userSchema.pick({ firstName: true, lastName: true, email: true }),
      params: uuidSchema,
    }),
    validateAuthUUID,
  ],
  paymentController.updateCustomer
);

module.exports = router;
