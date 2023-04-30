import clientPrivate from './index';

export const createCustomer = (userDetails) =>
  clientPrivate.post(`/payment/customers`, userDetails);
export const generateClientToken = (userId) =>
  clientPrivate.get(`/payment/customers/${userId}/generateToken`);
export const makeTransaction = (userId) =>
  clientPrivate.post(`/payment/transactions`, { customerId: userId }); // the key should be userId when we can correct it in the server side
