import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import { createUser, requestOTP } from '../api/user';
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
  const pwd = watch('password');
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

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
      setModalInfo({
        isError: true,
        message: errorMessage,
        onClose: () => {},
      });
      setModalVisible(true);
    }
  }

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
          className='my-6'
          entering={FadeInUp.duration(100)}
        >
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1685271570/Pass/registerIcon_hvaubt.png',
              width: 150,
              height: 150,
            }}
          />
        </Animated.View>
        <View className='justify-center w-full'>
          <Animated.View
            className='justify-center items-center bg-white px-7 py-10'
            entering={FadeInDown.duration(100)}
            exiting={FadeOutDown.duration(100)}
            style={{ borderTopEndRadius: 40, borderTopStartRadius: 40 }}
          >
              <Text className='font-semibold self-start text-slate-600 mb-1'>
                שם פרטי
              </Text>
              <InputBar
                input='firstName'
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
              <Text className='font-semibold self-start text-slate-600 mb-1'>
                שם משפחה
              </Text>
              <InputBar
                input='lastName'
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
              <Text className='font-semibold self-start text-slate-600 mb-1'>
                אימות סיסמא
              </Text>
              <InputBar
                input='confirmPassword'
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
                  onPress={handleSubmit(onRegister)}
                  style={{ borderRadius: 40 }}
                >
                  <Text className='text-lg font-bold'>הרשם</Text>
                </TouchableOpacity>
              </View>
          </Animated.View>
        </View>
      </View>
    </KeyboardDismiss>
  );
};

export default CreateAccountScreen;
