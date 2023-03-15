const express = require('express');

const usersController = require('../controllers/usersController');
const validateResource = require('../middlewares/validateResource');
const userSchema = require('../schemas/userSchema');

const router = express.Router();

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

module.exports = router;
