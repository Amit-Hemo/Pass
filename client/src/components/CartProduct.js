import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Text, View } from 'react-native';
import { deleteProductFromCart } from '../api/user';
import usePopup from '../hooks/usePopup';
import useUserStore from '../stores/user';
import handleApiError from '../utils/handleApiError';
import Box from './Box';
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
    <Box style={{paddingVertical: 12}}>
      <View className='flex-row items-center justify-between w-full'>
        <View className='items-start'>
          <Text className='text-base space-x-3 font-bold'>
            {name} - {size}
          </Text>
          <Text className='text-lg text-center text-gray-500 font-medium'>
            {price} ש"ח
          </Text>
        </View>
        <View className='flex-row space-x-3'>
          <Text className='text-lg text-center font-semibold'>{quantity}</Text>
          <MaterialIcons
            name='cancel'
            size={30}
            color='#FF6969'
            onPress={handleDelete}
            style={{ marginBottom: 8 }}
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
    </Box>
  );
};

export default CartProduct;
