import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { createCartTransaction, sendReceipt } from '../api/payment';
import { deleteCart, watchCart } from '../api/user';
import usePopup from '../hooks/usePopup';
import { setClearProduct } from '../stores/product';
import useUserStore from '../stores/user';
import calculateCartPrice from '../utils/calculateCartPrice';
import filterUnavailableTags from '../utils/filterUnavailableTags';
import handleApiError from '../utils/handleApiError';
import Popup from './Popup';

const CartPurchasePopup = ({ visible, setVisible, navigation }) => {
  const uuid = useUserStore((state) => state.uuid);
  const [isLoading, setIsLoading] = useState(false);
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const queryClient = useQueryClient();
  const { data: cart } = useQuery(['cart', uuid], () => watchCart(uuid), {
    select: (data) => {
      const filteredCart = filterUnavailableTags([...data.cart]);
      return filteredCart.reverse();
    },
  });
  const clearCartMutation = useMutation(deleteCart, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart', uuid]);
    },
    onError: (err) => {
      console.log('Cart error:', err);
      const errorMessage = handleApiError(err);
      setModalInfo({
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    },
  });

  let totalPrice = 0;
  if (cart) totalPrice = calculateCartPrice(cart);

  const handleCartPurchase = async () => {
    try {
      setVisible(false);
      setIsLoading(true);
      setModalVisible(true);

      const { data } = await createCartTransaction(uuid);
      const { transactionId } = data;

      setIsLoading(false);
      setModalVisible(false);
      setModalInfo({
        isError: false,
        message: 'הרכישה התבצעה בהצלחה, תתחדשו!',
        onClose: async () => {
          navigation.navigate('ReleaseProduct', { cart });
          setClearProduct();
          queryClient.invalidateQueries(['purchases', uuid]);
          clearCartMutation.mutate(uuid);
          try {
            await sendReceipt(uuid, transactionId);
          } catch (error) {
            console.log(error);
          }
        },
      });
      setModalVisible(true);
    } catch (error) {
      console.log(error?.response?.data?.error);
      const errorMessage = handleApiError(error);
      setIsLoading(false);
      setModalVisible(false);
      setModalInfo({
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    }
  };

  return (
    <View>
      <Modal
        isVisible={visible}
        animationIn={'bounceIn'}
        animationOut={'bounceOutDown'}
        className='w-2/3 self-center'
      >
        <View className='bg-white py-10 px-7 rounded-3xl justify-center items-center'>
          <Image
            className='w-28 h-28 mb-8'
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1683056863/Pass/payment_gnz7bw.png',
            }}
          />
          <Text className='text-xl text-center font-bold mb-4'>
            סכום סופי לתשלום:
          </Text>
          <Text className='text-xl text-center mb-4'>{totalPrice} ש"ח</Text>

          <View className='flex-row p-2 justify-evenly '>
            <TouchableOpacity
              className={`border-2 border-green-600 rounded-full px-6 pt-2 mx-4 ${
                Platform.OS === 'ios' ? 'pb-1' : 'pb-2'
              } items-center justify-center`}
              onPress={() => {
                handleCartPurchase();
                setVisible(false);
              }}
            >
              <Text className=' text-green-600 font-bold text-lg'>שלם</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={` border-2 border-red-700 rounded-full px-6 pt-2 mx-4 ${
                Platform.OS === 'ios' ? 'pb-1' : 'pb-2'
              } items-center justify-center`}
              onPress={() => {
                setVisible(false);
              }}
            >
              <Text className='text-red-600 font-bold text-lg'>בטל</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View>
        <Popup
          visible={modalVisible}
          isError={modalInfo.isError}
          setVisible={setModalVisible}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default CartPurchasePopup;
