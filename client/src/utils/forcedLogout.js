import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../constants/baseURL';
import { setIsForcedLogout } from '../stores/auth';

async function forcedLogout() {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    //logout user
    await axios.post(`${BASE_URL}/users/logout`, { refreshToken });

    //delete secure storage
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('signedWithProvider');
    setIsForcedLogout(true);
  } catch (error) {
    console.log(error);

    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('signedWithProvider');
    setIsForcedLogout(true);
  }
}

export default forcedLogout;
