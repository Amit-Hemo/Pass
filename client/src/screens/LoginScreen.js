import React, { useState } from "react";
import { Text, View } from "react-native";
import ActionButton from "../components/ActionButton";
import InputBar from "../components/InputBar";
import KeyboardDismiss from "../components/KeyboardDismiss";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handler = async () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <KeyboardDismiss>
      <View className="items-center flex-1 ">
        {/* title */}
        <Text className="mt-10 mb-5 text-3xl ">משתמש קיים</Text>
        {/* Login Details */}
        <View className="items-center mb-16">
          <Text className="text-lg">אימייל</Text>
          <InputBar
            input={email}
            onInputChange={setEmail}
            algin={"left"}
            style="mt-2 h-9 w-60 text-lg border-0.5 rounded-lg p-0.5"
          />

          <Text className="text-lg">סיסמא</Text>
          <InputBar
            input={password}
            onInputChange={setPassword}
            visible={false}
            algin={"left"}
            style="mt-2 h-9 w-60 text-lg border-0.5 rounded-lg p-0.5"
          />

          <ActionButton
            title="התחברות"
            handler={() => {
              navigation.navigate("Home");
            }}
          />
          <ActionButton
            title="שכחתי סיסמא"
            handler={() => {
              navigation.navigate("ForgotPassword");
            }}
          />
        </View>
        <View calssName="border-2" />
        <Text className="mt-10 mb-5 text-3xl">הצטרפות </Text>
        {/* Create a new user */}
        <ActionButton title="צור משתמש חדש" handler={handler} />
      </View>
    </KeyboardDismiss>
  );
};

export default LoginScreen;
