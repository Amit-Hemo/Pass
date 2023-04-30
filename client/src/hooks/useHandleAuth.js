import { useCallback } from 'react';
import checkAuthStatus from '../utils/checkAuthStatus';
import { setIsForcedLogout } from '../stores/auth';
import * as SecureStore from 'expo-secure-store';
import { logoutUser } from '../api/user';

function useHandleAuth() {
  async function logout() {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      //delete user in the server side
      await logoutUser(refreshToken);

      //delete secure storage
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');

      //delete global state
      setIsForcedLogout(true);
    } catch (error) {
      console.log(error);
    }
  }

  const handleAuth = useCallback(async () => {
    try {
      const accessToken = await checkAuthStatus();
      if (!accessToken) {
        await logout();
      }
      console.log('Access token Exist (Check!)');
    } catch (error) {
      console.log(error);
      await logout();
    }
  }, []);

  return handleAuth;
}

export default useHandleAuth;
