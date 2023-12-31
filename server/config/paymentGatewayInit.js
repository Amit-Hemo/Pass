const braintree = require('braintree')
const dotenv = require('dotenv')
dotenv.config()

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.MERCHANT_ID,
	publicKey: process.env.PUBLIC_KEY,
	privateKey: process.env.PRIVATE_KEY,
});

module.exports = gateway;
