const path = require('path')
const gateway = require('../config/paymentGatewayInit');

const getBraintreeUI = async (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'braintree.html'));
};

const createCostumer = async (req, res) => {
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
};

const getPaymentMethod = async (req, res) => {
	const { id } = req.params;
	try {
		const customer = await gateway.customer.find(id);
		const firstMethod = customer.paymentMethods[0];
		res.json({ firstMethod });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getClientToken = async (req, res) => {
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
};

const createTransaction = async (req, res) => {
	const { customerId } = req.body;
	try {
		// using default payment method
		const result = await gateway.transaction.sale({
			amount: '100.00',
			customerId,
		});
		res.status(200).json({ result: result.success });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
    getBraintreeUI,
    createCostumer,
    getPaymentMethod,
    getClientToken,
    createTransaction
}
