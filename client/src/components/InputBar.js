import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import React, { forwardRef } from "react";

const InputBar = forwardRef(
  (
    {
      input,
      visible = true,
      placeHolder,
      align,
      style,
      keyboardType,
      control,
      rules = {},
    },
    ref
  ) => {
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
            <View className="w-44 items-center">
              {/* Check if the input should be visible or invisible */}
              <TextInput
                className={style}
                onChangeText={onChange}
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                placeholder={placeHolder}
                textAlign={align}
                keyboardType={keyboardType}
                secureTextEntry={!visible}
                ref={ref}
              />
            </View>
            {error && (
              <Text className="text-red-500 mb-3">
                {error.message || "קרתה שגיאה לא צפויה, אנא נסו להיכנס מחדש"}
              </Text>
            )}
          </>
        )}
      />
    );
  }
);

export default InputBar;
