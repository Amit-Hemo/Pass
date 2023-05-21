import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { updatePassword } from '../api/user';
import ActionButton from '../components/ActionButton';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import Popup from '../components/Popup';
import {
  DIGIT_REGEX,
  LOWERCASE_REGEX,
  SPECIAL_CHAR_REGEX,
  UPPERCASE_REGEX,
} from '../constants/regexes';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import useUserStore from '../stores/user';
import handleApiError from '../utils/handleApiError';

const UpdatePasswordScreen = ({ navigation }) => {
  useAuth();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const uuid = useUserStore((state) => state.uuid);

  const { handleSubmit, watch, control } = useForm();
  const currPwd = watch('password');
  const newPwd = watch('newPassword');

  const onUpdatePassword = async (data) => {
    try {
      await updatePassword(uuid, data);

      setModalInfo({
        isError: false,
        message: 'סיסמא שונתה בהצלחה',
        onClose: () => {
          navigation.navigate('ProfileScreen');
        },
      });
      setModalVisible(true);
    } catch (error) {
      const errorMessage = handleApiError(error);

      setModalInfo({
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    }
  };

  const validateNewPassword = (value) => {
    if (
      !UPPERCASE_REGEX.test(value) ||
      !LOWERCASE_REGEX.test(value) ||
      !DIGIT_REGEX.test(value) ||
      !SPECIAL_CHAR_REGEX.test(value)
    ) {
      return 'הסיסמא חייבת להכיל: אות גדולה, אות קטנה, ספרה אחת וסימן מיוחד';
    }
    if (value === currPwd) {
      return 'יש להזין סיסמא שונה מקודמתה';
    }
    return true;
  };

  return (
    <KeyboardDismiss>
      <View className='items-center px-7'>
        <Text className='mt-10 mb-8 text-3xl'>יצירת סיסמא חדשה</Text>

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
          }}
        />
        <Text className='text-lg font-semibold'>סיסמא חדשה</Text>
        <InputBar
          input='newPassword'
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
            validate: validateNewPassword,
          }}
        />

        <Text className='text-lg font-semibold'>אימות סיסמא</Text>
        <InputBar
          input='confirmNewPassword'
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
            validate: (value) => value === newPwd || 'הסיסמאות אינן תואמות',
          }}
        />

        <ActionButton
          title='אישור'
          handler={handleSubmit(onUpdatePassword)}
        />

        <Popup
          visible={modalVisible}
          isError={modalInfo.isError}
          setVisible={setModalVisible}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />
      </View>
    </KeyboardDismiss>
  );
};

export default UpdatePasswordScreen;
