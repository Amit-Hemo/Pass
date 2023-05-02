import React from 'react';
import { Text, View, Image } from 'react-native';
import ProductBillDetails from './ProductBillDetails';
import ActionButton from './ActionButton';

{
  /* This component needs to speak with the DB and gets the product details :
name , price , image*/
}
const ScannedProductDetails = ({ productID, navigation }) => {
  const handler = async () => {
    //Need to implement 'add to cart'
    navigation.navigate('Home');
  };
  return (
    <View className="items-center mt-10 border-2 rounded-lg">
      <Text className="text-2xl font-bold">פרטי המוצר</Text>

      {/* Add product name and price got from the DB */}
      <ProductBillDetails productName="חולצה לבנה" price="100" />

      {/* product image got from the DB */}
      <Image
        className="rounded-xl w-30 h-20 mb-10"
        source={require('../../assets/1.png')}
      />

      {/* Quick purchase / Add to cart */}
      <View className="flex-row">
        <ActionButton
          title="רכישה מהירה"
          handler={() => {
            navigation.navigate('Bill');
          }}
        />
        <View className="px-1" />
        <ActionButton title="הוספה לסל" handler={handler} />
      </View>
    </View>
  );
};

export default ScannedProductDetails;
