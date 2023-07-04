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


const ScanProductScreen = ({ navigation }) => {
  useAuth();
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

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
