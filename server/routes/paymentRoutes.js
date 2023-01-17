const express = require('express');
const gateway = require('../config/paymentGatewayInit');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'braintree.html'));
});

router.post('/customers', async (req, res) => {
	//generate a client token
	const { firstName, lastName } = req.body;
	try {
		const createResult = await gateway.customer.create({
			firstName,
			lastName,
		});
		const customerId = createResult.customer.id;
		const result = await gateway.clientToken.generate({
			customerId,
		});
		const clientToken = result.clientToken;
		res.status(200).json({ customerId, clientToken });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/customers/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const customer = await gateway.customer.find(id);
		const firstMethod = customer.paymentMethods[0];
		res.json({ firstMethod });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/customers/:id/generateToken', async (req, res) => {
	const { id } = req.params;
	try {
		const result = await gateway.clientToken.generate({
			customerId: id,
		});
		const clientToken = result.clientToken;
		res.status(200).json({ clientToken });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/transactions', async (req, res) => {
	const { customerId } = req.body;
	try {
		// using default payment method
		const result = await gateway.transaction.sale({
			amount: '50.00',
			customerId,
		});
		res.status(200).json({result: result.success})
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;

// creates (success) a new costumer in the sandbox (see when can we use it with our app)
// const createResult = await gateway.customer.create({
// 	firstName,
// 	lastName,
// });
// console.log('====================================');
// console.log(createResult.success);
// console.log('====================================');
// const customerId = createResult.customer.id;
// const token = createResult.customer.paymentMethods[0].token;

// get costumer details by id
// const costumer = await gateway.customer.find('823571952');
// const res = await gateway.paymentMethod.create({
// 	customerId: '823571952',
// 	// paymentMethodNonce:
// });
// console.log(res);
// these 2 lines should be replaced somehow ????? with the comments below
// const response = await gateway.paymentMethodNonce.create(token);
// const nonce = response.paymentMethodNonce.nonce;
// gets the nonce from before and makes the purchase (seems success)
// const result = await gateway.transaction.sale({
// 	amount: '50.00',
// 	paymentMethodNonce: nonce,
// });
// console.log('====================================');
// console.log(result.success);
// console.log('====================================');
// res.sendStatus(200);
