import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { createUser, requestOTP } from '../api/user';
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
import handleApiError from '../utils/handleApiError';

const CreateAccountScreen = ({ navigation }) => {
  const { handleSubmit, watch, control } = useForm();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const pwd = watch('password');

  async function onRegister(data) {
    try {
      const { data: response } = await createUser(data);
      setModalVisible(true);
      setModalInfo({
        isError: false,
        message: 'המשתמש נוסף בהצלחה!',
        onClose: async () => {
          navigation.navigate('OTP', {
            email: data.email,
            destination: 'Login',
          });
          await requestOTP(response.email);
        },
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setModalVisible(true);
      setModalInfo({
        isError: true,
        message: errorMessage,
        onClose: () => {},
      });
    }
  }

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

        <Text className="mt-10 mb-8 text-3xl">יצירת משתמש</Text>
        <Text className="text-lg font-semibold">שם פרטי</Text>
        <InputBar
          input="firstName"
          control={control}
          rules={{
            required: 'שדה זה חובה',
            minLength: {
              value: 2,
              message: 'שדה זה מכיל לפחות 2 אותיות',
            },
            maxLength: {
              value: 100,
              message: 'שדה זה מכיל לכל היותר 100 אותיות',
            },
          }}
        />
        <Text className="text-lg font-semibold">שם משפחה</Text>
        <InputBar
          input="lastName"
          control={control}
          rules={{
            required: 'שדה זה חובה',
            minLength: {
              value: 2,
              message: 'שדה זה מכיל לפחות 2 אותיות',
            },
            maxLength: {
              value: 100,
              message: 'שדה זה מכיל לכל היותר 100 אותיות',
            },
          }}
        />
        <Text className="text-lg font-semibold">אימייל</Text>
        <InputBar
          input="email"
          control={control}
          rules={{
            required: 'שדה זה חובה',
            pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
          }}
        />
        <Text className="text-lg font-semibold">סיסמא</Text>
        <InputBar
          input="password"
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
        <Text className="text-lg font-semibold">אימות סיסמא</Text>
        <InputBar
          input="confirmPassword"
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
            validate: (value) => value === pwd || 'הסיסמאות אינן תואמות',
          }}
        />
        <ActionButton title="צור משתמש" handler={handleSubmit(onRegister)} />
      </View>
    </KeyboardDismiss>
  );
};

export default CreateAccountScreen;
