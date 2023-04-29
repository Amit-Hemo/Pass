import { client } from './index';

//Public routes (Access Token Is not mandatory)
export const createUser = (userDetails) => client.post('/users', userDetails);
export const requestOTP = (email) =>
  client.post('/users/requestOTP', { email });
export const loginUser = (userDetails) =>
  client.post('/users/login', userDetails);
export const validateOTP = (userDetails) =>
  client.post('/users/validateOTP', userDetails);
export const forgotPassword = (email) =>
  client.post('users/forgotPassword', { email });
export const resetPassword = (uuid, passwordsDetails) =>
  client.put(`users/${uuid}/resetPassword`, passwordsDetails);
export const handleRefreshToken = (refreshToken) =>
  client.post('users/refreshToken', { refreshToken });
export const logoutUser = (refreshToken) =>
  client.post('users/logout', { refreshToken });

//Private routes (Access Token Is mandatory)
export const getUser = (uuid) => client.get(`users/${uuid}`);
