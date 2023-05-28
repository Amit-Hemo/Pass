import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import { requestOTP, validateOTP } from '../api/user';
import KeyboardDismiss from '../components/KeyboardDismiss';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
import handleApiError from '../utils/handleApiError';

const OTPScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitted },
    reset,
  } = useForm();

  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const inputRefs = useRef([]);
  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const onOTPSend = async (data) => {
    console.log(data);
    const otp = Object.values(data).join('');

    const email = route.params?.email;
    const destination = route.params?.destination;

    try {
      const { data: response } = await validateOTP({ otp, email });
      setModalInfo({
        isError: false,
        message: 'תהליך האימות הסתיים בהצלחה!',
        onClose: () => {
          navigation.navigate(destination, { uuid: response.uuid });
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
          inputRefs.current[0].focus();
        },
      });
      setModalVisible(true);
    }
  };

  const onResendOTP = async () => {
    const email = route.params?.email;

    setIsLoading(true);
    try {
      setModalVisible(true);
      await requestOTP(email);
      setModalInfo({
        isError: false,
        message: 'קוד חדש נשלח בהצלחה!',
      });
      setIsLoading(false);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setIsLoading(false);

      setModalInfo({
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    }
  };

  const focusPrevInput = (index) => {
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const focusNextInput = (index) => {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
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
          className='mb-32 mt-20 justify-center items-center'
          entering={FadeInUp.duration(100)}
        >
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1685267389/Pass/otpMailIcon_atlnw6.png',
              width: 200,
              height: 200,
            }}
          />
          <Text className='text-white text-base font-bold mt-10'>
            יש להזין את קוד האימות שנשלח לאימייל:
          </Text>
          <Text className='text-white text-base font-bold mt-1'>
            {route.params?.email}
          </Text>
        </Animated.View>
        <View className='justify-center w-full'>
          <Animated.View
            className='justify-center items-center bg-white py-10 px-7'
            entering={FadeInDown.duration(100)}
            exiting={FadeOutDown.duration(100)}
            style={{ borderTopEndRadius: 40, borderTopStartRadius: 40 }}
          >
            <View className='flex-row-reverse items-center justify-center mb-2'>
              {[...Array(4)].map((_, index) => (
                <Controller
                  key={index}
                  control={control}
                  name={`otp${index + 1}`}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`${
                        errors[`otp${index + 1}`] && 'border border-red-500'
                      } bg-slate-100 rounded-md text-2xl text-center text-slate-600 px-5 py-3 mr-2`}
                      keyboardType='numeric'
                      value={value}
                      onChangeText={(value) => {
                        onChange(value);
                        if (value === '') {
                          focusPrevInput(index);
                        } else {
                          focusNextInput(index);
                        }
                      }}
                      onBlur={onBlur}
                      ref={(input) => {
                        inputRefs.current[index] = input;
                      }}
                      maxLength={1}
                    />
                  )}
                />
              ))}
            </View>
            {isSubmitted && !isValid && (
              <Text className='text-red-500 text-lg'>אנא הזן קוד תקין</Text>
            )}
            <Text
              className='text-yellow-500 text-center font-bold text-base my-[20px]'
              onPress={onResendOTP}
            >
              שליחת קוד מחדש
            </Text>
            <View className='w-full'>
              <TouchableOpacity
                className='bg-yellow-500 py-2 items-center justify-center mt-[20px]'
                onPress={handleSubmit(onOTPSend)}
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

export default OTPScreen;
