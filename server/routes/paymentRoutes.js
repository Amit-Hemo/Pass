const express = require('express');

const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.get('/', paymentController.getBraintreeUI);
router.post('/customers', paymentController.createCostumer);
router.get('/customers/:id', paymentController.getPaymentMethod);
router.get('/customers/:id/generateToken', paymentController.getClientToken);
router.post('/transactions', paymentController.createTransaction);

module.exports = router;