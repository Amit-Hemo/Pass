import { useFocusEffect } from '@react-navigation/native';
import { Video } from 'expo-av';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { getProduct } from '../api/stores';
import Popup from '../components/Popup';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import {
  setImage,
  setName,
  setPrice,
  setScanned,
  setSize,
  setSku,
  setTagUuid,
} from '../stores/product';
import readNFC from '../utils/readNFC';

// for development
// const tagUuid = '5d570740-87d5-45ab-a0e6-8bc73fa77107'; //Boruto Shirt
// const tagUuid = 'c9c8584e-ac63-4b6f-a0cf-029e8e44789c'; //Another Boruto Shirt
// const tagUuid = '6b78940e-7b26-45b0-8e30-829e998b2e37'; //Zoo shirt
// const tagUuid = '344cc5b4-7a9c-4b7b-b6f0-9d7c467f0ad0'; //Gucci shirt

const ScanProductScreen = ({ navigation }) => {
  useAuth();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const scanProduct = async () => {
        try {
          const tagUuid = await readNFC();

          setTagUuid(tagUuid);
          const { data } = await getProduct(tagUuid);
          const { product } = data;

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
    <View className='flex-1 items-center px-7'>
      <Text className='text-2xl my-10'>הצמד את הטלפון החכם לאטב</Text>
      <View className='rounded-xl justify-center items-center'>
        <Video
          style={{
            height: 320,
            width: 350,
            borderRadius: 20,
          }}
          source={{
            uri: 'https://res.cloudinary.com/dawvcozos/video/upload/v1685627960/Pass/scan_video_w9izub_rq6jgf.mp4',
          }}
          shouldPlay
          isLooping
          onReadyForDisplay={() => setIsVideoLoading(false)}
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

export default ScanProductScreen;
