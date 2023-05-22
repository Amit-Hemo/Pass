import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Button, Platform, Text, View } from 'react-native';
import {
  getGoogleClient,
  handleGoogleSignIn,
  loginUser,
  requestOTP,
} from '../api/user';
import ActionButton from '../components/ActionButton';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import Popup from '../components/Popup';
import {
  DIGIT_REGEX,
  EMAIL_REGEX,
  LOWERCASE_REGEX,
  SPECIAL_CHAR_REGEX,
  UPPERCASE_REGEX,
} from '../constants/regexes';
import usePopup from '../hooks/usePopup';
import {
  setAccessToken,
  setIsLoggedIn,
  setIsSignedWithProvider,
} from '../stores/auth';
import { setEmail, setFirstName, setLastName, setUuid } from '../stores/user';
import handleApiError from '../utils/handleApiError';

const LoginScreen = ({ navigation }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: 'itsamit442@gmail.com',
      password: 'Amit123!!',
    },
  });
  const [clientId, setClientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: clientId,
  });

  useEffect(() => {
    async function getClientId() {
      try {
        const { data } = await getGoogleClient(Platform.OS);
        setClientId(data.clientId);
        console.log(data.clientId);
      } catch (error) {
        console.log('failed to get provider clientId');
      }
    }
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      getClientId();
    }
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      onGoogleLogin(response.authentication.accessToken);
    } else {
      console.log('no google whyyyyyyyy');
    }
  }, [response]);

  const onGoogleLogin = async (googleToken) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${googleToken}` },
        }
      );
      const user = await response.json();
      const { given_name: firstName, family_name: lastName, email } = user;
      await onLogin({ firstName, lastName, email });
      setIsSignedWithProvider(true);
    } catch (error) {
      console.error('Sign in with google failed');
    }
  };

  const onLogin = async (data) => {
    setIsLoading(true);
    setModalVisible(true);
    try {
      let response;
      if (data?.password) {
        const { data: passwordLoginResponse } = await loginUser(data);
        response = passwordLoginResponse;
      } else {
        const { data: googleLoginResponse } = await handleGoogleSignIn(data);
        response = googleLoginResponse;
      }
      await SecureStore.setItemAsync('accessToken', response.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      setAccessToken(response.accessToken);

      const { uuid, firstName, lastName, email } = response.user;
      setUuid(uuid);
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setModalVisible(false)
      setIsLoading(false);
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleApiError(error);
      if (
        error.response?.data?.error === 'User must be verified before login'
      ) {
        setModalInfo({
          ...modalInfo,
          isError: true,
          message: errorMessage,
          onClose: async () => {
            navigation.navigate('OTP', {
              email: data.email,
              destination: 'Login',
            });
            await requestOTP(data.email);
          },
        });
      } else {
        setModalInfo({
          ...modalInfo,
          isError: true,
          message: errorMessage,
        });
      }
      setModalVisible(true);
    }
  };

  return (
    <KeyboardDismiss>
      <View className='flex-1 items-center mt-10'>
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
          isLoading={isLoading}
        />

        <Text className='text-3xl font-bold text-center mb-10'>משתמש קיים</Text>
        <View className='items-center mb-16'>
          <Text className='text-lg font-semibold '>אימייל</Text>
          <InputBar
            input='email'
            control={control}
            rules={{
              required: 'שדה זה חובה',
              pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
            }}
          />

          <Text className='text-lg font-semibold'>סיסמא</Text>
          <InputBar
            input='password'
            visible={false}
            control={control}
            rules={{
              required: 'שדה זה חובה',
              minLength: {
                value: 8,
                message: 'שדה זה מכיל לפחות 8 אותיות',
              },
              maxLength: {
                value: 100,
                message: 'שדה זה מכיל לכל היותר 100 אותיות',
              },
              validate: (value) =>
                (UPPERCASE_REGEX.test(value) &&
                  LOWERCASE_REGEX.test(value) &&
                  DIGIT_REGEX.test(value) &&
                  SPECIAL_CHAR_REGEX.test(value)) ||
                'הסיסמא חייבת להכיל: אות גדולה, אות קטנה, ספרה אחת וסימן מיוחד',
            }}
          />

          <View className='mt-6'>
            <ActionButton
              title='התחברות'
              handler={handleSubmit(onLogin)}
            />
          </View>

          <View className='mt-4'>
            <ActionButton
              title='שכחתי סיסמא'
              handler={() => {
                navigation.navigate('ForgotPassword');
              }}
            />
          </View>
        </View>

        <Button
          title='התחברות עם גוגל'
          disabled={!request}
          onPress={() => {
            setIsLoading(true);
            setModalVisible(true);
            promptAsync();
          }}
        />
        <ActionButton
          title='צור משתמש חדש'
          handler={() => {
            navigation.navigate('CreateAccount');
          }}
        />
      </View>
    </KeyboardDismiss>
  );
};

export default LoginScreen;
