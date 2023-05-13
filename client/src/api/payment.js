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
export const updateCustomer = (uuid, userDetails) =>
  clientPrivate.put(`/payment/customers/${uuid}`, userDetails);
export const createFastTransaction = (uuid, tagUuid) =>
  clientPrivate.post('/payment/transaction', { uuid, tagUuid });
export const createCartTransaction = (uuid) =>
  clientPrivate.post('/payment/transaction', { uuid });
export const sendReceipt = (uuid, transactionId) =>
  clientPrivate.post(`/payment/customers/${uuid}/receipt`, { transactionId });
