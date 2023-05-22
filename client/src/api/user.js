import { clientPrivate, clientPublic } from './index';

//Public routes (Access Token Is not mandatory)
export const createUser = (userDetails) =>
  clientPublic.post('/users', userDetails);
export const requestOTP = (email) =>
  clientPublic.post('/users/requestOTP', { email });
export const loginUser = (userDetails) =>
  clientPublic.post('/users/login', userDetails);
export const validateOTP = (userDetails) =>
  clientPublic.post('/users/validateOTP', userDetails);
export const forgotPassword = (email) =>
  clientPublic.post('users/forgotPassword', { email });
export const resetPassword = (uuid, passwordsDetails) =>
  clientPublic.put(`users/${uuid}/resetPassword`, passwordsDetails);
export const handleRefreshToken = (refreshToken) =>
  clientPublic.post('users/refreshToken', { refreshToken });
export const logoutUser = (refreshToken) =>
  clientPublic.post('users/logout', { refreshToken });
export const getGoogleClient = (platformOs) =>
  clientPublic.get(`users/providers/google/${platformOs}/getClientId`);
export const handleGoogleSignIn = (userDetails) =>
  clientPublic.post(`users/providers/google/signIn`, userDetails);

//Private routes (Access Token Is mandatory)
export const getUser = (uuid) => clientPrivate.get(`users/${uuid}`);
export const updateUser = (uuid, userDetails) =>
  clientPrivate.put(`users/${uuid}`, userDetails);
export const updatePassword = (uuid, data) =>
  clientPrivate.put(`users/${uuid}/updatePassword`, data);

export const watchCart = async (uuid) => {
  const { data } = await clientPrivate.get(`users/${uuid}/cart`);
  return data;
};
export const addProductToCart = async ([uuid, tagUuid]) => {
  return await clientPrivate.post(`users/${uuid}/cart`, { tagUuid });
};
export const deleteCart = async (uuid) => {
  return await clientPrivate.delete(`users/${uuid}/cart`);
};
export const deleteProductFromCart = async ([uuid, tagUuid]) => {
  return await clientPrivate.delete(`users/${uuid}/cart/${tagUuid}`);
};

export const watchPurchases = async (uuid) => {
  const { data } = await clientPrivate.get(`users/${uuid}/purchases`);
  return data;
};
export const watchPurchaseById = async (uuid, transactionId) => {
  const { data } = await clientPrivate.get(
    `users/${uuid}/purchases/${transactionId}`
  );
  return data;
};
