import { clientPrivate } from './index';

export const createCustomer = (userDetails) =>
  clientPrivate.post(`/payment/customers`, userDetails);
export const generateClientToken = (uuid) =>
  clientPrivate.get(`/payment/customers/${uuid}/generateToken`);
export const makeTransaction = (uuid) =>
  clientPrivate.post(`/payment/transactions`, { customerId: uuid }); // the key should be userId when we can correct it in the server side
export const isBraintreeCustomer = (uuid) =>
  clientPrivate.get(`payment/customers/${uuid}/isBraintreeCustomer`);
export const getBraintreeUI = () => clientPrivate.get('/');
export const getPaymentMethod = (uuid) =>
  clientPrivate.get(`/payment/customers/${uuid}`);
