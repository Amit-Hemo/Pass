import React from 'react';
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
import useAuth from '../hooks/useAuth';

const UpdatePasswordScreen = ({ navigation }) => {
  useAuth();

  const { handleSubmit, watch, control } = useForm();
  const currPwd = watch('password');
  const newPwd = watch('newPassword');

  const onUpdatePassword = (data) => {
    console.log(data);
    navigation.navigate('Profile');
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
      <View className="items-center">
        <Text className="text-base mt-10 mb-8 text-3xl">יצירת סיסמא חדשה</Text>

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
          }}
        />
        <Text className="text-xl">סיסמא חדשה</Text>
        <InputBar
          input="newPassword"
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
            validate: validateNewPassword,
          }}
        />

        <Text className="text-xl">אימות סיסמא</Text>
        <InputBar
          input="confirmNewPassword"
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
            validate: (value) => value === newPwd || 'הסיסמאות אינן תואמות',
          }}
        />

        <ActionButton title="אישור" handler={handleSubmit(onUpdatePassword)} />
      </View>
    </KeyboardDismiss>
  );
};

export default UpdatePasswordScreen;
