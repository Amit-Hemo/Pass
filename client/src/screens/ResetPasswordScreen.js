import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import {
  DIGIT_REGEX,
  LOWERCASE_REGEX,
  SPECIAL_CHAR_REGEX,
  UPPERCASE_REGEX,
} from '../constants/regexes';
import handleApiError from '../utils/handleApiError';
import { resetPassword } from '../api/user';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { handleSubmit, watch, control, reset } = useForm();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const inputRef = useRef();

  const pwd = watch('newPassword');

  const uuid = route.params?.uuid;

  const onResetPassword = async (data) => {
    console.log(data);

    try {
      await resetPassword(uuid, data);

      setModalInfo({
        isError: false,
        message: 'הסיסמא שונתה בהצלחה!',
        onClose: () => {
          navigation.navigate('Login');
        },
      });
      setModalVisible(true);
    } catch (error) {
      const errorMessage = handleApiError(error);

      setModalInfo({
        isError: true,
        message: errorMessage,
        onClose: () => {
          reset();
          inputRef.current?.focus();
        },
      });
      setModalVisible(true);
    }
  };

  return (
    <KeyboardDismiss>
      <View className="items-center flex-1">
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />

        <Text className="mt-10 mb-8 text-3xl">יצירת סיסמא חדשה</Text>

        <Text className="text-lg font-semibold">סיסמא חדשה</Text>
        <InputBar
          input="newPassword"
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
          ref={inputRef}
        />

        <Text className="text-lg font-semibold">אימות סיסמא</Text>
        <InputBar
          input="confirmNewPassword"
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
            validate: (value) => value === pwd || 'הסיסמאות אינן תואמות',
          }}
        />

        <ActionButton title="אישור" handler={handleSubmit(onResetPassword)} />
      </View>
    </KeyboardDismiss>
  );
};

export default ResetPasswordScreen;
