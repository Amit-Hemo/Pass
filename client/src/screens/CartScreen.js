import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import ProductsBillList from '.././components/ProductsBillList';
import { watchCart } from '../api/user';
import ActionButton from '../components/ActionButton';
import CartPurchasePopup from '../components/CartPurchasePopup';
import useAuth from '../hooks/useAuth';
import useUserStore from '../stores/user';
import calculateCartPrice from '../utils/calculateCartPrice';

const CartScreen = ({ navigation }) => {
  useAuth();
  const [visible, setVisible] = useState(false);
  const isCustomer = useUserStore((state) => state.isCustomer);
  const hasCreditCard = useUserStore((state) => state.hasCreditCard);
  const uuid = useUserStore((state) => state.uuid);
  const { data } = useQuery(['cart', uuid], () => watchCart(uuid));

  let totalPrice = 0;
  if (data?.cart) totalPrice = calculateCartPrice(data?.cart);

  const handleCartPurchase = () => {
    setVisible(true);
  };

  return (
    <View className='mt-10 items-center'>
      <Text className='mb-20 text-3xl  '>עגלת קניות</Text>
      {isCustomer && hasCreditCard ? (
        <View className='items-center px-9'>
          <View className='rounded-lg border-2 px-2'>
            <View className='flex-row-reverse w-full my-4'>
              <Text className='text-2xl font-bold w-3/6 text-center'>
                שם מוצר
              </Text>
              <Text className='text-2xl font-bold w-1/6 text-center'>
                כמות{' '}
              </Text>
              <Text className='text-2xl font-bold w-2/6 text-center'>מחיר</Text>
            </View>

            <View className='h-80'>
              <ProductsBillList cart={data?.cart} />
            </View>
          </View>

          <View className='mt-5 items-center'>
            <Text className='text-lg mb-3'>סך הכל {totalPrice} ש"ח</Text>
           {data?.cart?.length > 0 && <ActionButton
              title='מעבר לתשלום'
              handler={handleCartPurchase}
            />}
          </View>
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
