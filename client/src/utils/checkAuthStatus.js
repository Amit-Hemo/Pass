import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { BASE_URL } from '../constants/baseURL';

async function checkAuthStatus() {
  let accessToken;
  try {
    accessToken = await SecureStore.getItemAsync('accessToken');
    if (!accessToken) throw new Error('No Access Token');

    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // access token has expired

      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      if (!refreshToken) throw new Error('No Refresh Token');

      const decodedToken = jwtDecode(refreshToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime)
        throw new Error('Refresh Token has been expired');
      // use refresh token to get new access token
      console.log('refreshing');

      //handle refresh token
      const { data } = await axios.post(`${BASE_URL}/users/refreshToken`, {
        refreshToken,
      });

      console.log('created new access token!');
      accessToken = data.accessToken;

      await SecureStore.setItemAsync('accessToken', accessToken);
    }
  } catch (error) {
    accessToken = null;
    throw new Error(
      error.message ? error.message : 'Error while restoring the token'
    );
  }
  return accessToken;
}

export default checkAuthStatus;
