import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import ProductsBillList from '.././components/ProductsBillList';
import { deleteCart, watchCart } from '../api/user';
import ActionButton from '../components/ActionButton';
import CartPurchasePopup from '../components/CartPurchasePopup';
import Popup from '../components/Popup';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import useUserStore from '../stores/user';
import calculateCartPrice from '../utils/calculateCartPrice';
import handleApiError from '../utils/handleApiError';

const CartScreen = ({ navigation }) => {
  useAuth();
  const [visible, setVisible] = useState(false); //For purchase popup
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const isCustomer = useUserStore((state) => state.isCustomer);
  const hasCreditCard = useUserStore((state) => state.hasCreditCard);
  const uuid = useUserStore((state) => state.uuid);
  const queryClient = useQueryClient();
  const { data: cart } = useQuery(['cart', uuid], () => watchCart(uuid), {
    select: (data) => [...data.cart].reverse(),
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

  const handleCartPurchase = () => {
    setVisible(true); //Start purchase popup
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(uuid);
  };

  return (
    <View className='mt-10 items-center'>
      <Text className='mb-20 text-3xl  '>עגלת קניות</Text>
      {isCustomer && hasCreditCard ? (
        <View className='items-center px-7'>
          <View className='rounded-lg border-2 px-2'>
            <View className='flex-row-reverse w-full my-4'>
              <Text className='text-2xl font-bold w-5/12 text-center'>
                שם מוצר
              </Text>
              <Text className='text-2xl font-bold w-2/12 text-center'>
                כמות{' '}
              </Text>
              <Text className='text-2xl font-bold w-4/12 text-center'>
                מחיר
              </Text>
              <Text className='text-2xl font-bold w-1/12 text-center'></Text>
            </View>

            <View className='h-80'>
              <ProductsBillList cart={cart} />
            </View>
          </View>

          <View className='mt-5 items-center'>
            <Text className='text-xl mb-3'>סך הכל {totalPrice} ש"ח</Text>
            {cart?.length > 0 && (
              <View className='flex-row'>
                <ActionButton
                  title='מעבר לתשלום'
                  handler={handleCartPurchase}
                />
                <ActionButton
                  title='מחיקת עגלה'
                  handler={handleClearCart}
                />
              </View>
            )}
          </View>
          <Popup
            visible={modalVisible}
            isError={modalInfo.isError}
            setVisible={setModalVisible}
            onClose={modalInfo.onClose}
            message={modalInfo.message}
          />
          <CartPurchasePopup
            visible={visible}
            setVisible={setVisible}
            navigation={navigation}
          />
        </View>
      ) : (
        <View className='items-center border-2 rounded-xl mx-2'>
          <Text className='text-xl text-center font-bold mb-2 text-red-500 p-10'>
            {' '}
            קיימות אופציות נוספות בעמוד זה לאחר הוספת אמצעי תשלום ראשוני בעמוד
            הראשי{' '}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CartScreen;
