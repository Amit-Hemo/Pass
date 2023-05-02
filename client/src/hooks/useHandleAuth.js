import { useCallback } from 'react';
import checkAuthStatus from '../utils/checkAuthStatus';
import { setAccessToken } from '../stores/auth';
import forcedLogout from '../utils/forcedLogout';

function useHandleAuth() {
  const handleAuth = useCallback(async () => {
    try {
      const accessToken = await checkAuthStatus();
      if (!accessToken) {
        await forcedLogout();
      }

      setAccessToken(accessToken);
      console.log('Access token Exist (Check!)');
    } catch (error) {
      console.log(error);
      await forcedLogout();
    }
  }, []);

  return handleAuth;
}

export default useHandleAuth;
