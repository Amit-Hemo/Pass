import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { addProductToCart } from '../api/user';
import usePopup from '../hooks/usePopup';
import useProductStore, { setClearProduct } from '../stores/product';
import useUserStore from '../stores/user';
import handleApiError from '../utils/handleApiError';
import ActionButton from './ActionButton';
import FastPurchasePopup from './FastPurchasePopup';
import Popup from './Popup';

const ProductBillDetails = ({ navigation }) => {
  const name = useProductStore((state) => state.name);
  const size = useProductStore((state) => state.size);
  const price = useProductStore((state) => state.price);
  const image = useProductStore((state) => state.image);
  const tagUuid = useProductStore((state) => state.tagUuid);
  const uuid = useUserStore((state) => state.uuid);
  const [visible, setVisible] = useState(false);
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const queryClient = useQueryClient();
  const mutation = useMutation(addProductToCart, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart', uuid]);
      setClearProduct();
    },
    onError: (err) => {
      const errorMessage = handleApiError(err);
      setModalInfo({
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    },
  });

  const handleAddToCart = () => {
    mutation.mutate([uuid, tagUuid]);
  };

  const handleFastPurchase = () => {
    setVisible(true);
  };

  return (
    <View className='items-center'>
      <Image
        className='rounded-xl mb-2'
        source={{ uri: image, width: 200, height: 200 }}
      />
      <View className='my-3 self-start'>
        <Text className='text-xl mb-3 font-[900]'>{name}</Text>
        <Text className='text-lg font-bold'>
          מידה:
          <Text className='text-slate-600 font-normal'> {size}</Text>
        </Text>
        <Text className='text-lg font-bold'>
          מחיר:
          <Text className='text-slate-600 font-normal'> {price} ש"ח</Text>
        </Text>
      </View>

      <View className='flex-row w-full justify-evenly'>
        <ActionButton
          title='רכישה מהירה'
          handler={handleFastPurchase}
          style={{flex: 1, marginRight: 20}}
        />
        <ActionButton
          title='הוספה לסל'
          handler={handleAddToCart}
          style={{flex: 1}}
        />
      </View>

      <FastPurchasePopup
        visible={visible}
        setVisible={setVisible}
        navigation={navigation}
      />
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

export default ProductBillDetails;
