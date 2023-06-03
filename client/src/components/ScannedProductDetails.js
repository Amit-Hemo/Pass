import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import useProductStore, { setClearProduct } from '../stores/product';
import ProductBillDetails from './ProductBillDetails';

const ScannedProductDetails = ({ navigation }) => {
  const scannedProduct = useProductStore((state) => state.scanned);

  return (
    <View
      className='items-center mt-6 rounded-3xl px-6 py-3 bg-white w-full'
      style={{
        elevation: 5,
        shadowColor: 'gray',
        shadowOpacity: 0.7,
        shadowOffset: 10,
      }}
    >
      {scannedProduct ? (
        <View>
          <View className='flex-row justify-center items-center '>
            <View className='self-end w-full'>
              <MaterialIcons
                name='cancel'
                size={30}
                color='#FF6969'
                onPress={setClearProduct}
              />
            </View>
          </View>
          <ProductBillDetails navigation={navigation} />
        </View>
      ) : (
        <View className='items-center mx-2 w-60 h-66'>
          <Text className='text-xl text-center my-2'>לא נסרק מוצר</Text>
          <Image
            className='rounded-3xl mb-4'
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/o_45/v1683048746/Pass/WhatsApp_Image_2023-05-02_at_20.26.08_byuo2a.jpg',
              width: 250,
              height: 250,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ScannedProductDetails;
