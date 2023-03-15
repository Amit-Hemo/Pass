const express = require('express');

const usersController = require('../controllers/usersController');
const validateResource = require('../middlewares/validateResource');
const userSchema = require('../schemas/userSchema');

const router = express.Router();

router.post('/', validateResource({body: userSchema}), usersController.createUser)

module.exports = router