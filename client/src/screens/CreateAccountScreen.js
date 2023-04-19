import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import {
  DIGIT_REGEX,
  EMAIL_REGEX,
  LOWERCASE_REGEX,
  SPECIAL_CHAR_REGEX,
  UPPERCASE_REGEX,
} from '../constants/regexes';

const CreateAccountScreen = ({ navigation }) => {
  const { handleSubmit, watch, control } = useForm();
  const pwd = watch('password');

  const onRegister = (data) => {
    console.log(data);
  };

  return (
    <KeyboardDismiss>
      <View className='items-center'>
        <Text className='text-base mt-10 mb-8 text-3xl'>יצירת משתמש</Text>

        <Text className='text-xl'>שם פרטי</Text>
        <InputBar
          input='firstName'
          control={control}
          align={'right'}
          style='mt-2 mb-1 h-9 w-60 text-xl border-2 rounded-lg p-0.5'
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

        <Text className='text-xl'>שם משפחה</Text>
        <InputBar
          input='lastName'
          style='mt-2 mb-1 h-9 w-60 text-xl border-2 rounded-lg p-0.5'
          align='right'
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

        <Text className='text-xl'>אימייל</Text>
        <InputBar
          input='email'
          style='mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5'
          align='left'
          control={control}
          rules={{
            required: 'שדה זה חובה',
            pattern: { value: EMAIL_REGEX, message: 'פורמט אימייל שגוי' },
          }}
        />

        <Text className='text-xl'>סיסמא</Text>
        <InputBar
          input='password'
          style='mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5'
          align='right'
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

        <Text className='text-xl'>אימות סיסמא</Text>
        <InputBar
          input='confirmPassword'
          style='mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5'
          align='right'
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

        <ActionButton
          title='צור משתמש'
          handler={handleSubmit(onRegister)}
        />
      </View>
    </KeyboardDismiss>
  );
};

export default CreateAccountScreen;
