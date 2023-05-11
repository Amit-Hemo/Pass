import React from 'react';
import { Text, View, Image } from 'react-native';
import ProductBillDetails from './ProductBillDetails';
import useProductStore from '../stores/product';
import { MaterialIcons } from '@expo/vector-icons';
import { setClearProduct } from '../stores/product';

const ScannedProductDetails = ({ navigation }) => {
  const scannedProduct = useProductStore((state) => state.scanned);

  return (
    <View className="items-center mt-6 p-6 border-2 rounded-lg">
      {scannedProduct ? (
        <View className="w-60 h-66">
          <View className="flex-row justify-between items-center">
            <MaterialIcons
              name="cancel"
              size={30}
              color="#FF6969"
              onPress={setClearProduct}
            />
            <Text className="text-2xl font-bold mr-24">פרטי המוצר</Text>
          </View>
          <ProductBillDetails navigation={navigation} />
        </View>
      ) : (
        <View className="items-center mx-2 w-60 h-66">
          <Text className="text-2xl font-bold">פרטי המוצר</Text>

          <Text className="text-xl text-center mt-2">לא נסרק מוצר</Text>
          <Image
            className="rounded-xl w-60 h-60"
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/o_45/v1683048746/Pass/WhatsApp_Image_2023-05-02_at_20.26.08_byuo2a.jpg',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ScannedProductDetails;
