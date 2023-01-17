import React, { useState } from "react";
import { Text, View } from "react-native";
import KeyboardDismiss from "../components/KeyboardDismiss";
import InputBar from "../components/InputBar";
import ActionButton from "../components/ActionButton";

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <KeyboardDismiss>
      <View className="items-center mt-10">
        <Text className="text-base mb-6 text-3xl"> פרופיל משתמש</Text>
        <Text className="text-base mb-2 text-xl font-bold">  יוסי כהן</Text>
        <Text className="text-base mb-6 text-xl font-bold">  yossi_cohen@gmail.com </Text>

        <ActionButton
          title="ערוך פרטים"
          screen="ProfileScreen"
          navigation={navigation}
        />
        
        <Text className="text-base mt-14 mb-6 text-3xl">פרטי אשראי</Text>
        <Text className="text-base mb-2 text-lg"> כרטיס ראשי</Text>
        <Text className="text-base text-xl border-0.5 rounded-lg px-5 h-7 mb-5">
          XXXX-XXXX-XXXX-6789
        </Text>
        
        <ActionButton
          title="ערוך פרטי אשראי"
          screen="EditPaymentMethod"
          navigation={navigation}
        />

        <View className="mt-20">
          <ActionButton
            title="היסטורית רכישות"
            screen="PurchasesHistory"
            navigation={navigation}
          />
        </View>
      </View>
    </KeyboardDismiss>
  );
};

export default ProfileScreen;
