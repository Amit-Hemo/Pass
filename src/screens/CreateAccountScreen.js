import React from "react";
import { Text, View, InputText } from "react-native";
import KeyboardDismiss from "../components/KeyboardDismiss";

const CreateAccountScreen = () => {
  return (
    <KeyboardDismiss>
      <View className="items-center">
        <Text className="text-base mt-10 mb-20 text-3xl">יצירת משתמש</Text>
      </View>
    </KeyboardDismiss>
  );
};

export default CreateAccountScreen;
