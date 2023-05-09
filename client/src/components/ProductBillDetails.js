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
      <View className='items-center w-80'>
        <View className='flex-row mt-4'>
          <Text className='text-xl px-10 '>{`${price} ש"ח`}</Text>
          <Text className=' text-xl px-10 mb-2'>{`${name} - ${size}`}</Text>
        </View>

        <Image
          className='rounded-xl w-60 h-60 mb-6'
          source={{ uri: image }}
        />

        <View className='flex-row space-x-10'>
          <ActionButton
            title='רכישה מהירה'
            handler={handleFastPurchase}
          />
          <View className='' />
          <ActionButton
            title='הוספה לסל'
            handler={handleAddToCart}
          />
        </View>
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
