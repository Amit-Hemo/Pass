import { useFocusEffect } from '@react-navigation/native';
import { AppState } from 'react-native';
import useHandleAuth from './useHandleAuth';
import { useCallback, useEffect, useState } from 'react';

function useAuth() {
  const handleAuth = useHandleAuth();

  useEffect(() => {
    console.log('component rendered');
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) handleAuth();

      return () => {
        isActive = false;
      };
    }, [handleAuth])
  );
}
export default useAuth;
