import React from "react";
import { Text, View } from "react-native";

const ProductBillDetails = ({ productName, price }) => {
  return (
    <View className="items-center">
      <View className="flex-row">
        <Text className="text-base text-xl px-10 py-4">{`${price} ש"ח`}</Text>
        <Text className="text-base text-xl px-10 py-4">{productName}</Text>
      </View>
    </View>
  );
};

export default ProductBillDetails;
