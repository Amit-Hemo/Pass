import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import { forgotPassword, requestOTP } from '../api/user';
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
      <View className='items-center flex-1 bg-[#3BABFE] justify-between'>
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />
        <Animated.View
          className='my-10 justify-center items-center'
          entering={FadeInUp.duration(100)}
        >
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1685267329/Pass/forgotPasswordIcon_mevwyp.png',
              width: 150,
              height: 150,
            }}
            className='mr-5'
          />
          <Text className='text-white text-base font-bold mt-10'>
            יש להזין את כתובת המייל בכדי לקבל קוד אימות
          </Text>
        </Animated.View>
        <View className='justify-center w-full'>
          <Animated.View
            className='justify-center items-center bg-white py-10 px-7'
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
            <View className='w-full'>
              <TouchableOpacity
                className='bg-yellow-500 py-2 items-center justify-center mt-[20px]'
                onPress={handleSubmit(onForgotPassword)}
                style={{ borderRadius: 40 }}
              >
                <Text className='text-lg font-bold'>המשך</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </KeyboardDismiss>
  );
};

export default ForgotPasswordScreen;
