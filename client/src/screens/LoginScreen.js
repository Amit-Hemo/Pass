import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import {
  getGoogleClient,
  handleGoogleSignIn,
  loginUser,
  requestOTP,
} from '../api/user';
import GoogleButton from '../components/GoogleButton';
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
  const [isRegistering, setIsRegistering] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: clientId,
  });

  useEffect(() => {
    async function getClientId() {
      try {
        const { data } = await getGoogleClient(Platform.OS);
        setClientId(data.clientId);
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
    } else if (response?.type === 'error') {
      console.log(response?.error.message);
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
      setModalVisible(false);
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
      <View className='items-center flex-1 bg-[#3BABFE] justify-between'>
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
          isLoading={isLoading}
        />
        <Animated.View
          className='my-20'
          entering={FadeInUp.duration(100)}
        >
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1685267286/Pass/loginIcon_plpauq.png',
              width: 200,
              height: 200,
            }}
          />
        </Animated.View>
        <View className='justify-center w-full'>
          <Animated.View
            className='justify-center items-center bg-white py-10 px-7 '
            entering={FadeInDown.duration(100)}
            exiting={FadeOutDown.duration(100)}
            style={{ borderTopEndRadius: 40, borderTopStartRadius: 40 }}
          >
            <Text className='font-semibold self-start text-slate-600 mb-1'>
              אימייל
            </Text>
            <InputBar
              input='email'
              control={control}
              rules={{
                required: 'שדה זה חובה',
                pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
              }}
            />
            <Text className='font-semibold self-start text-slate-600 mb-1'>
              סיסמא
            </Text>
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
            <Text
              className='self-start font-semibold -translate-y-1 text-yellow-500'
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              שכחת סיסמא?
            </Text>
            <View className='w-full'>
              <TouchableOpacity
                className='bg-yellow-500 py-2 items-center justify-center mt-[20px]'
                onPress={handleSubmit(onLogin)}
                style={{ borderRadius: 40 }}
              >
                <Text className='text-lg font-bold'>התחבר</Text>
              </TouchableOpacity>
            </View>
            <Text className='font-bold text-xl my-2 text-slate-500'>או</Text>
            <GoogleButton
              handler={() => {
                setIsLoading(true);
                setModalVisible(true);
                promptAsync();
                setModalVisible(false);
              }}
              disabled={!request || !clientId}
            />
          </Animated.View>
        </View>
      </View>
    </KeyboardDismiss>
  );
};

export default LoginScreen;
