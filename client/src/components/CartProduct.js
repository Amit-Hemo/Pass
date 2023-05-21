import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Text, View } from 'react-native';
import { deleteProductFromCart } from '../api/user';
import usePopup from '../hooks/usePopup';
import useUserStore from '../stores/user';
import handleApiError from '../utils/handleApiError';
import Popup from './Popup';

const CartProduct = ({ name, size, price, quantity, tags }) => {
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const queryClient = useQueryClient();
  const uuid = useUserStore((state) => state.uuid);
  const deleteMutation = useMutation(deleteProductFromCart, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart', uuid]);
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

  const handleDelete = () => {
    const lastTag = tags[tags.length - 1].uuid;
    deleteMutation.mutate([uuid, lastTag]);
  };

  return (
    <View className='flex-row items-center'>
      <Text className='text-xl text-center w-5/12 mb-2'>
        {name} - {size}
      </Text>
      <Text className='text-xl text-center w-2/12 mb-2'>{quantity}</Text>
      <Text className='text-xl text-center w-4/12 mb-2'>{price} ש"ח</Text>
      <MaterialIcons
        name='cancel'
        size={30}
        color='#FF6969'
        onPress={handleDelete}
        style={{ marginBottom: 8 }}
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

export default CartProduct;
