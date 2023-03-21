const express = require("express");

const usersController = require("../controllers/usersController");
const validateResource = require("../middlewares/validateResource");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const validateAuthUUID = require("../middlewares/validateAuthUUID");
const userSchema = require("../schemas/userSchema");
const uuidSchema = require("../schemas/uuidSchema");
const refreshTokenSchema = require("../schemas/refreshTokenSchema");
const changePasswordSchema = require("../schemas/changePasswordSchema");

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

module.exports = router;
