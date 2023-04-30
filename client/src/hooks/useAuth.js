import { useFocusEffect } from '@react-navigation/native';
import { AppState } from 'react-native';
import useHandleAuth from './useHandleAuth';

function useAuth() {
  const handleAuth = useHandleAuth();

  useFocusEffect(() => {
    if (AppState.currentState === 'active') {
      handleAuth();
    }
  });
}

export default useAuth;
