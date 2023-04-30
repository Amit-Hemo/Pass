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

  clientPrivate.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      try {
        if ([401, 403].includes(error?.response?.status)) {
          await forcedLogout();
        }
        throw new Error(error);
      } catch (error) {
        throw new Error(error);
      }
    }
  );

  config.headers.authorization = `Bearer ${accessToken}`;

  return config;
});
