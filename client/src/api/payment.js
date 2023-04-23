import client from './index';

export const createCustomer = (userDetails) =>
	client.post(`/payment/customers`, userDetails);
export const generateClientToken = (userId) =>
	client.get(`/payment/customers/${userId}/generateToken`);
export const makeTransaction = (userId) =>
	client.post(`/payment/transactions`, { customerId: userId }); // the key should be userId when we can correct it in the server side
