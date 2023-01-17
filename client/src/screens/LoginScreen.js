import React, { useState } from "react";
import { Text, View, InputText, TouchableOpacity } from "react-native";
import ActionButton from "../components/ActionButton";
import InputBar from "../components/InputBar";
import KeyboardDismiss from "../components/KeyboardDismiss";

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardDismiss>
      <View className="items-center flex-1 ">
        {/* title */}
        <Text className="mt-10 mb-5 text-3xl ">משתמש קיים</Text>
        {/* Login Details */}
        <View className="items-center mb-16">
          <InputBar
            input={userName}
            onInputChange={setUserName}
            placeHolder="שם משתמש"
            algin={"right"}
            style="mt-2 h-9 w-60 text-lg border-0.5 rounded-lg p-0.5"
          />

          <InputBar
            input={password}
            onInputChange={setPassword}
            visible={false}
            placeHolder="סיסמא"
            algin={"right"}
            style="mt-2 h-9 w-60 text-lg border-0.5 rounded-lg p-0.5"
          />

          <ActionButton title="התחברות" screen="Home" navigation={navigation} />
          <ActionButton
            title="שכחתי סיסמא"
            screen="ForgotPassword"
            navigation={navigation}
          />
        </View>
        <View calssName="border-2" />
        <Text className="mt-10 mb-5 text-3xl">הצטרפות </Text>
        {/* Create a new user */}
        <ActionButton
          title="צור משתמש חדש"
          screen="CreateAccount"
          navigation={navigation}
        />
        
      </View>
    </KeyboardDismiss>
  );
};

export default LoginScreen;
