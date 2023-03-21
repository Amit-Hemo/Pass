const express = require("express");

const paymentController = require("../controllers/paymentController");
const validateResource = require("../middlewares/validateResource");
const uuidSchema = require("../schemas/uuidSchema");
const userSchema = require("../schemas/userSchema");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

const router = express.Router();
router.use(verifyAccessToken);

router.get("/", paymentController.getBraintreeUI);
router.post(
  "/customers",
  validateResource({
    body: userSchema
      .pick({ firstName: true, lastName: true, email: true })
      .merge(uuidSchema),
  }),
  paymentController.createCustomer
);
router.get(
  "/customers/:uuid",
  validateResource({ params: uuidSchema }),
  paymentController.getPaymentMethod
);
router.get(
  "/customers/:uuid/generateToken",
  validateResource({ params: uuidSchema }),
  paymentController.getClientToken
);
router.post(
  "/transactions",
  validateResource({ body: uuidSchema }),
  paymentController.createTransaction
);
router.put(
  "/customers/:uuid",
  validateResource({
    body: userSchema.pick({ firstName: true, lastName: true, email: true }),
    params: uuidSchema,
  }),
  paymentController.updateCustomer
);

module.exports = router;
