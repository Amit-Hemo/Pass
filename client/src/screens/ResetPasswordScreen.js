import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import { resetPassword } from '../api/user';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import Popup from '../components/Popup';
import {
  DIGIT_REGEX,
  LOWERCASE_REGEX,
  SPECIAL_CHAR_REGEX,
  UPPERCASE_REGEX,
} from '../constants/regexes';
import usePopup from '../hooks/usePopup';
import handleApiError from '../utils/handleApiError';

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
      <View className='items-center flex-1 bg-[#3BABFE] justify-between'>
        <Popup
          visible={modalVisible}
          setVisible={setModalVisible}
          isError={modalInfo.isError}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />
        <Animated.View
          className='mb-52 mt-20 justify-center items-center'
          entering={FadeInUp.duration(100)}
        >
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1685267354/Pass/createNewPasswordIcon_p8verp.png',
              width: 200,
              height: 200,
            }}
            className='mr-5'
          />
        </Animated.View>
        <View className='justify-center w-full'>
          <Animated.View
            className='justify-center items-center bg-white py-10 px-7'
            entering={FadeInDown.duration(100)}
            exiting={FadeOutDown.duration(100)}
            style={{ borderTopEndRadius: 40, borderTopStartRadius: 40 }}
          >
            <Text className='font-semibold self-start text-slate-600 mb-1'>סיסמא חדשה</Text>
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
                validate: (value) =>
                  (UPPERCASE_REGEX.test(value) &&
                    LOWERCASE_REGEX.test(value) &&
                    DIGIT_REGEX.test(value) &&
                    SPECIAL_CHAR_REGEX.test(value)) ||
                  'הסיסמא חייבת להכיל: אות גדולה, אות קטנה, ספרה אחת וסימן מיוחד',
              }}
              ref={inputRef}
            />

            <Text className='font-semibold self-start text-slate-600 mb-1'>אימות סיסמא</Text>
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
                validate: (value) => value === pwd || 'הסיסמאות אינן תואמות',
              }}
            />
            <View className='w-full'>
              <TouchableOpacity
                className='bg-yellow-500 py-2 items-center justify-center mt-[20px]'
                onPress={handleSubmit(onResetPassword)}
                style={{ borderRadius: 40 }}
              >
                <Text className='text-lg font-bold'>שמור סיסמא</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </KeyboardDismiss>
  );
};

export default ResetPasswordScreen;
