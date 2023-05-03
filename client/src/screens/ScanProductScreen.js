import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { Video } from 'expo-av';
import useAuth from '../hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { getProduct } from '../api/stores';
import {
  setName,
  setSize,
  setPrice,
  setImage,
  setSku,
  setScanned,
  setTagUuid,
} from '../stores/product';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';

// for development
const tagUuid = '5d570740-87d5-45ab-a0e6-8bc73fa77107'; //Boruto Shirt
// const tagUuid = 'c9c8584e-ac63-4b6f-a0cf-029e8e44789c'; //Another Boruto Shirt
// const tagUuid = '6b78940e-7b26-45b0-8e30-829e998b2e37'; //Zoo shirt
// const tagUuid = '344cc5b4-7a9c-4b7b-b6f0-9d7c467f0ad0'; //Gucci shirt

const ScanProductScreen = ({ navigation }) => {
  useAuth();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  useFocusEffect(
    useCallback(() => {
      const scanProduct = async () => {
        try {
          //TODO: Should implement the nfc scan (get tagUuid)
          setTagUuid(tagUuid);
          const { data } = await getProduct(tagUuid);
          const { product } = data;
          console.log(product);

          setName(product.name);
          setSize(product.size);
          setPrice(product.price);
          setImage(product.image);
          setSku(product.sku);
          setScanned(true);

          setModalInfo({
            isError: false,
            message: 'המוצר נסרק בהצלחה',
            onClose: () => {
              navigation.navigate('HomeScreen');
            },
          });
          setModalVisible(true);
        } catch (error) {
          setModalInfo({
            isError: true,
            message: 'שגיאה בעת סריקת המוצר',
            onClose: () => {
              navigation.navigate('HomeScreen');
            },
          });
          setModalVisible(true);
        }
      };
      scanProduct();
    }, [])
  );
  return (
    <View className="items-center border-1 mt-10">
      <Text className=" text-3xl">הצמד את הטלפון החכם לאטב</Text>
      <View className="h-full flex-col items-center justify-center bottom-20">
        <Video
          style={{ height: 350, width: 400 }}
          source={{
            uri: 'https://res.cloudinary.com/dawvcozos/video/upload/v1682935506/Pass/scan_video_w9izub.mp4',
          }}
          shouldPlay
          isLooping
        />
      </View>

      <Popup
        visible={modalVisible}
        isError={modalInfo.isError}
        setVisible={setModalVisible}
        onClose={modalInfo.onClose}
        message={modalInfo.message}
      />
    </View>
  );
};

{
  /* In that part we will need to return the ID from the scanned RFID and send it details to Home */
}

export default ScanProductScreen;
