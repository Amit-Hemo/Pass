import { View, Text } from "react-native";
import InputBar from "./InputBar";
import React, { useState } from "react";

const CreditCard = ({ input, onInputChange, action, placeHolder }) => {
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState(""); //   Visa uses CVV


  return (
    <View className="h-50 w-80 border items-center rounded-lg mb-2">
      <InputBar
        input={nameOnCard}
        onInputChange={setNameOnCard}
        placeHolder="שם בעל הכרטיס"
        algin={"right"}
        style="mt-5 h-9 w-64 text-lg border-0.5 rounded-lg p-0.5"
      />

      <InputBar
        input={cardNumber}
        onInputChange={setCardNumber}
        visible={false}
        placeHolder="XXXX-XXXX-XXXX-XXXX"
        algin={"center"}
        style="mt-2 h-9 w-64 text-lg border-0.5 rounded-lg p-0.5 "
        keyboardType="numeric"
      />

      <View className="flex-row h-16">
        <InputBar
          input={cvv}
          onInputChange={setCvv}
          visible={false}
          placeHolder="CVV"
          algin={"left"}
          style="mt-2 h-9 w-10 text-lg border-0.5 rounded-lg p-0.5 "
          keyboardType="numeric"
          maxLength={3}
        />

        <View className="flex-row">
          <Text className="text-sm absolute mt-4 ">EXPIRES</Text>
          <InputBar
            input={expiration}
            onInputChange={setExpiration}
            placeHolder="mm/yy"
            algin={"left"}
            style="mt-2 h-9 w-16 text-lg border-0.5 rounded-lg p-0.5 ml-5"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );
};

export default CreditCard;
