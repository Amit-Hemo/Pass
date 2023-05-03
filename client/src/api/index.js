import axios from 'axios';
import { BASE_URL } from '../constants/baseURL';
import checkAuthStatus from '../utils/checkAuthStatus';
import forcedLogout from '../utils/forcedLogout';

export const clientPrivate = axios.create({
  baseURL: BASE_URL,
});

export const clientPublic = axios.create({
  baseURL: BASE_URL,
});

clientPrivate.interceptors.request.use(async (config) => {
  const accessToken = await checkAuthStatus();

  if (!accessToken) {
    await forcedLogout();
  }

  config.headers.authorization = `Bearer ${accessToken}`;

  return config;
});

clientPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      if ([401, 403].includes(error?.response?.status)) {
        await forcedLogout();
      }
      return Promise.reject(error);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);
