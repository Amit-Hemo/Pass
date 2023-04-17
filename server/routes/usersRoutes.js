const express = require("express");

const usersController = require("../controllers/usersController");
const validateResource = require("../middlewares/validateResource");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const validateAuthUUID = require("../middlewares/validateAuthUUID");
const userSchema = require("../schemas/userSchema");
const uuidSchema = require("../schemas/uuidSchema");
const otpSchema = require("../schemas/otpSchema");
const skuSchema = require("../schemas/skuSchema");
const refreshTokenSchema = require("../schemas/refreshTokenSchema");
const changePasswordSchema = require("../schemas/changePasswordSchema");
const tagUuidSchema=require("../schemas/tagUuidSchema");

const router = express.Router();

router.put(
  "/:uuid",
  [
    verifyAccessToken,
    validateResource({
      body: userSchema.pick({ firstName: true, lastName: true, email: true }),
      params: uuidSchema,
    }),
    validateAuthUUID,
  ],
  usersController.updateUser
);

router.put(
  "/:uuid/updatePassword",
  [
    verifyAccessToken,
    validateResource({
      body: userSchema
        .pick({ password: true })
        .merge(changePasswordSchema)
        .refine((data) => data.newPassword === data.confirmNewPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
      params: uuidSchema,
    }),
    validateAuthUUID,
  ],
  usersController.updatePassword
);

router.put(
  "/:uuid/resetPassword",
  validateResource({
    body: changePasswordSchema.refine(
      (data) => data.newPassword === data.confirmNewPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    ),
    params: uuidSchema,
  }),
  usersController.resetPassword
);

router.post(
  "/",
  validateResource({
    body: userSchema.refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
  }),
  usersController.createUser
);

router.post(
  "/login",
  validateResource({ body: userSchema.pick({ email: true, password: true }) }),
  usersController.loginUser
);

router.post(
  "/logout",
  validateResource({ body: refreshTokenSchema }),
  usersController.logoutUser
);

router.post(
  "/refreshToken",
  validateResource({ body: refreshTokenSchema }),
  usersController.handleRefreshToken
);

router.post(
  "/forgotPassword",
  validateResource({ body: userSchema.pick({ email: true }) }),
  usersController.forgotPassword
);

router.post(
  "/validateOTP",
  validateResource({ body: userSchema.pick({ email: true }).merge(otpSchema) }),
  usersController.validateOTP
);

router.post(
  "/:uuid/addProductToCart",
  [
    verifyAccessToken,
    validateResource({
      params: uuidSchema,
      body: tagUuidSchema,
    }),
    validateAuthUUID,
  ],
  usersController.addProductToCart
);

router.delete(
  "/:uuid/deleteProductFromCart/:tagUuid",
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema.merge(tagUuidSchema) }),
    validateAuthUUID,
  ],
  usersController.deleteProductFromCart
);

router.get(
  "/:uuid",
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema }),
    validateAuthUUID,
  ],
  usersController.watchCart
);

module.exports = router;
