import React, { useState } from "react";
import { Text, View } from "react-native";
import KeyboardDismiss from "../components/KeyboardDismiss";
import InputBar from "../components/InputBar";
import ActionButton from "../components/ActionButton";

const CreateAccountScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handler = () => {
    const formDetails = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };
    console.log(formDetails);
    navigation.navigate("Home");
  };

  return (
    <KeyboardDismiss>
      <View className="items-center">
        <Text className="text-base mt-10 mb-8 text-3xl">יצירת משתמש</Text>
        <Text className="text-xl">שם פרטי</Text>
        <InputBar
          input={firstName}
          onInputChange={setFirstName}
          algin={"right"}
          style="mt-2 mb-4 h-9 w-60 text-xl border-2 rounded-lg p-0.5"
          required={true}
        />

        <Text className="text-xl">שם משפחה</Text>
        <InputBar
          input={lastName}
          onInputChange={setLastName}
          algin={"right"}
          style="mt-2 mb-4 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
        />

        <Text className="text-xl">אימייל</Text>
        <InputBar
          input={email}
          onInputChange={setEmail}
          algin={"left"}
          style="mt-2 mb-4 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
        />

        <Text className="text-xl">סיסמא</Text>
        <InputBar
          input={password}
          onInputChange={setPassword}
          algin={"right"}
          visible={false}
          style="mt-2 mb-4 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
        />

        <Text className="text-xl">אימות סיסמא</Text>
        <InputBar
          input={confirmPassword}
          onInputChange={setConfirmPassword}
          algin={"right"}
          visible={false}
          style="mt-2 mb-10 h-9 w-60 text-lg border-2 rounded-lg p-0.5"
        />

        <ActionButton title={"צור משתמש"} handler={handler} />
      </View>
    </KeyboardDismiss>
  );
};

export default CreateAccountScreen;
