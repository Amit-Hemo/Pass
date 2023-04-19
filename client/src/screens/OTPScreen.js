import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import KeyboardDismiss from '../components/KeyboardDismiss';

const OTPScreen = ({ navigation }) => {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isValid, isSubmitted },
  } = useForm();

  const inputRefs = useRef([]);

  const onOTPSend = async (data) => {
    console.log(data);
    const otp = Object.values(data).join('');
    console.log(otp);
    // if (otp.length < 4) {
    //   [...Array(4)].forEach((_, index) => {
    //     const name = `otp${index + 1}`;
    //     setError(name, {
    //       type: 'manual',
    //     });
    //   });
    // }
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
      <View className='items-center flex-1'>
        <Text className='mt-10 mb-5 text-3xl '>אימות</Text>
        <Text className='mb-5 text-lg'>נא להזין את הקוד שנשלח לאימייל</Text>

        <View className='flex-row items-center justify-center mb-2'>
          {[...Array(4)].map((_, index) => (
            <Controller
              key={index}
              control={control}
              name={`otp${index + 1}`}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  // height: 64,
                  // borderWidth: 1,
                  // borderColor: errors[`otp${index + 1}`] ? 'red' : 'gray',
                  // borderRadius: 8,
                  // fontSize: 24,
                  // textAlign: 'center',
                  // marginRight: 8,
                  className={`border-[1.5px] ${
                    errors[`otp${index + 1}`] && 'border-red-500'
                  } rounded-md text-3xl text-center p-2 mr-2`}
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

        <ActionButton
          title='אישור'
          handler={handleSubmit(onOTPSend)}
        />
        <ActionButton
          title='שליחת קוד מחדש'
          handler={handleSubmit(onOTPSend)}
        />
        
      </View>
    </KeyboardDismiss>
  );
};

export default OTPScreen;
