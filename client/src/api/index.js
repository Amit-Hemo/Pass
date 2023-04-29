import axios from 'axios';
import useAuthStore from '../stores/auth';

// for development
const baseURL = 'http://192.168.1.32:5000';

export const client = axios.create({
  baseURL,
});

client.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.authorization = `Bearer ${accessToken}`;
  return config;
});
