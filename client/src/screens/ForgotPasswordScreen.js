import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { forgotPassword, requestOTP } from '../api/user';
import ActionButton from '../components/ActionButton';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import Popup from '../components/Popup';
import { EMAIL_REGEX } from '../constants/regexes';
import usePopup from '../hooks/usePopup';
import handleApiError from '../utils/handleApiError';

const ForgotPasswordScreen = ({ navigation }) => {
  const { handleSubmit, control } = useForm();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const onForgotPassword = async (data) => {
    const email = data.email;

    try {
      await forgotPassword(email);

      setModalInfo({
        isError: false,
        message: 'קוד זיהוי נשלח לכתובת האימייל',
        onClose: async () => {
          navigation.navigate('OTP', {
            email: data.email,
            destination: 'ResetPassword',
          });
          await requestOTP(email);
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

  return (
    <KeyboardDismiss>
      <View className='items-center flex-1'>
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />

        <Text className=' mt-10 mb-8 text-3xl'>שחזור סיסמא</Text>

        <Text className='text-lg font-semibold'>אימייל</Text>
        <InputBar
          input='email'
          control={control}
          rules={{
            required: 'שדה זה חובה',
            pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
          }}
        />

        <ActionButton
          title='המשך'
          handler={handleSubmit(onForgotPassword)}
        />
      </View>
    </KeyboardDismiss>
  );
};

export default ForgotPasswordScreen;
