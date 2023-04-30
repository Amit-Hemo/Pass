import { setIsForcedLogout } from '../stores/auth';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../constants/baseURL';
import axios from 'axios';

async function forcedLogout() {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    //logout user
    await axios.post(`${BASE_URL}/users/logout`, { refreshToken });

    //delete secure storage
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');

    setIsForcedLogout(true);
  } catch (error) {
    console.log(error);

    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');

    setIsForcedLogout(true);
  }
}

export default forcedLogout;
