import React from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import ActionButton from "../components/ActionButton";
import InputBar from "../components/InputBar";
import KeyboardDismiss from "../components/KeyboardDismiss";
import { EMAIL_REGEX } from "../constants/regexes";

const ForgotPasswordScreen = ({ navigation }) => {
  const { handleSubmit, control } = useForm();

  const onForgotPassword = (data) => {
    console.log(data);
    navigation.navigate("OTP", {
      email: data.email,
      destination: "ResetPassword",
    });
  };

  return (
    <KeyboardDismiss>
      <View className="items-center">
        <Text className="text-base mt-10 mb-8 text-3xl">שחזור סיסמא</Text>

        <Text className="text-xl">אימייל</Text>
        <InputBar
          input="email"
          style="mt-2 mb-1 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
          align="left"
          control={control}
          rules={{
            required: "שדה זה חובה",
            pattern: { value: EMAIL_REGEX, message: "פורמט אימייל שגוי" },
          }}
        />

        <ActionButton title="המשך" handler={handleSubmit(onForgotPassword)} />
      </View>
    </KeyboardDismiss>
  );
};

export default ForgotPasswordScreen;
