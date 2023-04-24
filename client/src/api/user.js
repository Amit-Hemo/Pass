import client from './index';

export const createUser = (userDetails) => client.post('/users', userDetails);
export const requestOTP = (email) => client.post('/users/requestOTP', {email});
export const loginUser = (userDetails) => client.post('/users/login', userDetails);
