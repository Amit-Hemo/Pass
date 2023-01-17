import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import KeyboardDismiss from "../components/KeyboardDismiss";
import InputBar from "../components/InputBar";
import ActionButton from "../components/ActionButton";
import CreditCard from "../components/CreditCard";

const EditPaymentMethodScreen = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <KeyboardDismiss>
      <View className="items-center mt-10">
        <Text className="text-base mb-10 text-3xl"> פרטי אשראי </Text>

        <TouchableOpacity
          onPress={() => {
            setIsVisible(!isVisible);
          }}
          className="items-center content-center h-8 w-60 mt-1 mb-2 rounded-2xl border-t-2 border-b-2 "
        >
          <Text className="text-lg">הצג כרטיס 1</Text>
        </TouchableOpacity>

        {/* We need a list of credit cards components */}
        <ScrollView className="w-80 h-2/3 mb-5 ">
          <View className="items-center">
            {isVisible && (
              <View>
                <CreditCard />
                <View className="flex-row">
                  <ActionButton
                    title="שמור"
                    screen="EditPaymentMethodScreen"
                    navigation={navigation}
                  />
                  <ActionButton
                    title="הגדר כראשי"
                    screen="EditPaymentMethodScreen"
                    navigation={navigation}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <ActionButton
          title="הוסף כרטיס אשראי"
          screen="EditPaymentMethodScreen"
          navigation={navigation}
        />
      </View>
    </KeyboardDismiss>
  );
};

export default EditPaymentMethodScreen;
