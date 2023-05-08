const express = require('express');

const usersController = require('../controllers/usersController');
const validateResource = require('../middlewares/validateResource');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const validateAuthUUID = require('../middlewares/validateAuthUUID');
const userSchema = require('../schemas/userSchema');
const uuidSchema = require('../schemas/uuidSchema');
const otpSchema = require('../schemas/otpSchema');
const refreshTokenSchema = require('../schemas/refreshTokenSchema');
const changePasswordSchema = require('../schemas/changePasswordSchema');
const tagUuidSchema = require('../schemas/tagUuidSchema');
const transactionSchema = require('../schemas/transactionSchema');

const router = express.Router();

router.put(
  '/:uuid',
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
  '/:uuid/updatePassword',
  [
    verifyAccessToken,
    validateResource({
      body: userSchema
        .pick({ password: true })
        .merge(changePasswordSchema)
        .refine((data) => data.newPassword === data.confirmNewPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        })
        .refine((data) => data.password !== data.newPassword, {
          message: 'New password is the same as before',
          path: ['newPassword'],
        }),
      params: uuidSchema,
    }),
    validateAuthUUID,
  ],
  usersController.updatePassword
);

router.put(
  '/:uuid/resetPassword',
  validateResource({
    body: changePasswordSchema.refine(
      (data) => data.newPassword === data.confirmNewPassword,
      {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      }
    ),
    params: uuidSchema,
  }),
  usersController.resetPassword
);

router.post(
  '/',
  validateResource({
    body: userSchema.refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
  }),
  usersController.createUser
);

router.post(
  '/login',
  validateResource({ body: userSchema.pick({ email: true, password: true }) }),
  usersController.loginUser
);

router.post(
  '/logout',
  validateResource({ body: refreshTokenSchema }),
  usersController.logoutUser
);

router.post(
  '/refreshToken',
  validateResource({ body: refreshTokenSchema }),
  usersController.handleRefreshToken
);

router.post(
  '/forgotPassword',
  validateResource({ body: userSchema.pick({ email: true }) }),
  usersController.forgotPassword
);

router.post(
  '/requestOTP',
  validateResource({ body: userSchema.pick({ email: true }) }),
  usersController.requestOTP
);

router.post(
  '/validateOTP',
  validateResource({ body: userSchema.pick({ email: true }).merge(otpSchema) }),
  usersController.validateOTP
);

router.post(
  '/:uuid/cart',
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
  '/:uuid/cart/:tagUuid',
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema.merge(tagUuidSchema) }),
    validateAuthUUID,
  ],
  usersController.deleteProductFromCart
);

router.delete(
  '/:uuid/cart',
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema }),
    validateAuthUUID,
  ],
  usersController.deleteCart
);

router.get(
  '/:uuid/cart',
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema }),
    validateAuthUUID,
  ],
  usersController.watchCart
);

router.get(
  '/:uuid',
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema }),
    validateAuthUUID,
  ],
  usersController.getUser
);

router.get(
  '/:uuid/purchases',
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema }),
    validateAuthUUID,
  ],
  usersController.watchPurchases
);

router.get(
  '/:uuid/purchases/:transactionId',
  [
    verifyAccessToken,
    validateResource({ params: uuidSchema.merge(transactionSchema) }),
    validateAuthUUID,
  ],
  usersController.watchPurchaseById
);

module.exports = router;
