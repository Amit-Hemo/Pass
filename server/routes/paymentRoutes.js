const express = require("express");

const paymentController = require("../controllers/paymentController");
const validateResource = require("../middlewares/validateResource");
const validateAuthUUID = require("../middlewares/validateAuthUUID");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const uuidSchema = require("../schemas/uuidSchema");
const userSchema = require("../schemas/userSchema");

const router = express.Router();
router.use(verifyAccessToken);

router.get("/", paymentController.getBraintreeUI);
router.post(
  "/customers",
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
  "/customers/:uuid",
  [validateResource({ params: uuidSchema }), validateAuthUUID],
  paymentController.getPaymentMethod
);
router.get(
  "/customers/:uuid/generateToken",
  [validateResource({ params: uuidSchema }), validateAuthUUID],
  paymentController.getClientToken
);
router.post(
  "/transactions",
  [validateResource({ body: uuidSchema }), validateAuthUUID],
  paymentController.createTransaction
);
router.put(
  "/customers/:uuid",
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
