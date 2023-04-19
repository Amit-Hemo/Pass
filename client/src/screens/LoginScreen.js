import React from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import InputBar from '../components/InputBar';
import KeyboardDismiss from '../components/KeyboardDismiss';
import { EMAIL_REGEX } from '../constants/regexes';

const LoginScreen = ({ navigation }) => {
  const { handleSubmit, control } = useForm();

  const onLogin = async (data) => {
    console.log(data);
    navigation.navigate('Home');
  };

  return (
    <KeyboardDismiss>
      <View className='items-center flex-1 '>
        <Text className='mt-10 mb-5 text-3xl '>משתמש קיים</Text>

        <View className='items-center mb-16'>
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
            }}
          />

          <ActionButton
            title='התחברות'
            handler={handleSubmit(onLogin)}
          />
          <ActionButton
            title='שכחתי סיסמא'
            handler={() => {
              navigation.navigate('ForgotPassword');
            }}
          />
        </View>
     
        <ActionButton
          title='צור משתמש חדש'
          handler={() => {
            navigation.navigate('CreateAccount');
          }}
        />
      </View>
    </KeyboardDismiss>
  );
};

export default LoginScreen;
