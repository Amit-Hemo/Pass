const express = require("express");

const usersController = require("../controllers/usersController");
const validateResource = require("../middlewares/validateResource");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const userSchema = require("../schemas/userSchema");
const uuidSchema = require("../schemas/uuidSchema");
const refreshTokenSchema = require("../schemas/refreshTokenSchema");

const router = express.Router();

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
router.put(
  "/:uuid",
  [
    verifyAccessToken,
    validateResource({
      body: userSchema.pick({ firstName: true, lastName: true, email: true }),
      params: uuidSchema,
    }),
  ],
  usersController.updateUser
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
