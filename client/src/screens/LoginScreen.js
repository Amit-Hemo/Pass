import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { loginUser, requestOTP } from '../api/user';
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
import { setAccessToken, setIsLoggedIn } from '../stores/auth';
import { setEmail, setFirstName, setLastName, setUuid } from '../stores/user';
import handleApiError from '../utils/handleApiError';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
  const { handleSubmit, control } = useForm();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const onLogin = async (data) => {
    console.log(data);
    try {
      const { data: response } = await loginUser(data);
      await SecureStore.setItemAsync('accessToken', response.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      setAccessToken(response.accessToken);

      const { uuid, firstName, lastName, email } = response.user;
      setUuid(uuid);
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);

      setIsLoggedIn(true);
    } catch (error) {
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
      <View className="flex-1 items-center">
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />

        <Text className="mt-10 mb-5 text-3xl ">משתמש קיים</Text>
        <View className="items-center mb-16">
          <Text className="text-xl">אימייל</Text>
          <InputBar
            input="email"
            style="mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
            align="left"
            control={control}
            rules={{
              required: 'שדה זה חובה',
              pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
            }}
          />

          <Text className="text-xl">סיסמא</Text>
          <InputBar
            input="password"
            style="mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
            align="right"
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

          <ActionButton title="התחברות" handler={handleSubmit(onLogin)} />
          <ActionButton
            title="שכחתי סיסמא"
            handler={() => {
              navigation.navigate('ForgotPassword');
            }}
          />
        </View>

        <ActionButton
          title="צור משתמש חדש"
          handler={() => {
            navigation.navigate('CreateAccount');
          }}
        />
      </View>
    </KeyboardDismiss>
  );
};

export default LoginScreen;
