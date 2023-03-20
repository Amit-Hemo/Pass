const express = require("express");

const usersController = require("../controllers/usersController");
const validateResource = require("../middlewares/validateResource");
const userSchema = require("../schemas/userSchema");
const uuidSchema = require("../schemas/uuidSchema");

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
  validateResource({
    body: userSchema.pick({ firstName: true, lastName: true, email: true }),
    params: uuidSchema,
  }),
  usersController.updateUser
);

router.post(
  "/login",
  validateResource({ body: userSchema.pick({ email: true, password: true }) }),
  usersController.loginUser
);

module.exports = router;
