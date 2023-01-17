import React from "react";
import { Text, View } from "react-native";
import ProductsBillList from ".././components/ProductsBillList";
import ActionButton from "../components/ActionButton";

const CartScreen = ({ navigation }) => {
  return (
    <View className="mt-10 items-center">
      <Text className="text-base mb-20 text-3xl  ">עגלת קניות</Text>

      <View className="rounded-lg w-3/4 border-2">
        <View className="flex-row">
          <Text className="text-base text-xl px-10 py-4 font-bold">מחיר</Text>
          <Text className="text-base text-xl px-16 py-4 pb-5 font-bold">
            שם מוצר
          </Text>
        </View>

        <View className="h-80">
          <ProductsBillList />
        </View>
      </View>

      <View className="absolute top-2/3 mt-56 items-center">
        <Text>סך הכל 100 ש"ח</Text>
        <ActionButton
          title="מעבר לתשלום"
          screen="Bill"
          navigation={navigation}
        />
      </View>
    </View>
  );
};

export default CartScreen;
