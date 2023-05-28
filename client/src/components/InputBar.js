import { Feather } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

const InputBar = forwardRef(
  ({ input, placeHolder, keyboardType, control, rules = {} }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Controller
        control={control}
        name={input}
        rules={rules}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <View
              className={`w-full px-5 py-2 ${
                !error && 'mb-2'
              } bg-slate-100 focus:border-blue-500 focus:border-2 ${
                (input.toLowerCase().includes('password') ||
                  input === 'email') &&
                'flex-row justify-between items-center'
              }`}
              style={{ borderRadius: 40 }}
            >
              {input.toLowerCase().includes('password') &&
                (visible ? (
                  <Feather
                    name='eye-off'
                    size={20}
                    color='gray'
                    onPress={() => setVisible(false)}
                  />
                ) : (
                  <Feather
                    name='eye'
                    size={20}
                    color='gray'
                    onPress={() => setVisible(true)}
                  />
                ))}
              {input === 'email' && (
                <Feather
                  name='mail'
                  size={20}
                  color='gray'
                />
              )}
              <TextInput
                className={`${
                  (input === 'email' ||
                    input.toLowerCase().includes('password')) &&
                  'flex-1 ml-2'
                }`}
                onChangeText={onChange}
                autoCapitalize='none'
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                placeholder={placeHolder}
                keyboardType={keyboardType}
                secureTextEntry={
                  input.toLowerCase().includes('password') && !visible
                }
                ref={ref}
              />
            </View>
            {error && (
              <Text className='text-red-500 mb-3'>
                {error.message || 'קרתה שגיאה לא צפויה, אנא נסו להיכנס מחדש'}
              </Text>
            )}
          </>
        )}
      />
    );
  }
);

export default InputBar;
