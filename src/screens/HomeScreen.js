import React from "react";
import { Text, View } from "react-native";
import ActionButton from "../components/ActionButton";
import ScannedProductDetails from "../components/ScannedProductDetails";

const HomeScreen = ({ navigation }) => {
  return (
    <View className="items-center mt-10">
      <ActionButton
        title="לחץ לסריקת מוצר"
        screen="ScanProduct"
        navigation={navigation}
      />

      {/* In that part we will need to return the ID from the scanned RFID and send it to the DB.
       send it to ScannedProductDetails */}
      {/* Product details component */}
      <ScannedProductDetails productID="1" navigation={navigation} />
    </View>
  );
};

export default HomeScreen;
