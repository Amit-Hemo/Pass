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

//Private routes (Access Token Is mandatory)
export const getUser = (uuid) => clientPrivate.get(`users/${uuid}`);
