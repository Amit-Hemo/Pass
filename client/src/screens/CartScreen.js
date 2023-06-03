import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import ProductsBillList from '.././components/ProductsBillList';
import { deleteCart, watchCart } from '../api/user';
import ActionButton from '../components/ActionButton';
import Box from '../components/Box';
import CartPurchasePopup from '../components/CartPurchasePopup';
import HorizonalLine from '../components/HorizonalLine';
import Popup from '../components/Popup';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';
import useUserStore from '../stores/user';
import calculateCartPrice from '../utils/calculateCartPrice';
import filterUnavailableTags from '../utils/filterUnavailableTags';
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

  const handleCartPurchase = () => {
    setVisible(true); //Start purchase popup
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(uuid);
  };

  return (
    <View className='flex-1 px-7'>
      {isCustomer && hasCreditCard ? (
        <View className='mt-5'>
          {cart?.length > 0 ? (
            <>
              <Text className='text-xl font-semibold text-center mb-4'>
                {cart[0]?.tags[0]?.attachedStore?.merchantID ?? ''}
              </Text>
              <ProductsBillList cart={cart} />
              <HorizonalLine />
              <View className='flex-row justify-between items-center space-x-3 mb-3'>
                <Text className='text-lg font-semibold text-blue-900'>
                  סך הכל לתשלום:
                </Text>
                <Text className='text-lg font-bold text-blue-900'>
                  {totalPrice} ש"ח
                </Text>
              </View>
              <ActionButton
                title='מעבר לתשלום'
                handler={handleCartPurchase}
                style={{ marginVertical: 10 }}
              />
              <ActionButton
                title='מחיקת עגלה'
                handler={handleClearCart}
                style={{ marginBottom: 10 }}
              />
            </>
          ) : (
            <View className='items-center justify-center mb-5 h-[400]'>
              <Image source={{uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1685791058/Pass/5D80A8CD-3815-4F42-9DFE-2523A5A6ADF6_ljkwi4.png', width: 200, height: 200}} style={{marginStart: 35}}/>
              <Text className='text-xl font-bold mt-10'>העגלה ריקה</Text>
            </View>
          )}

          <Box>
            <Text className='text-base text-center text-red-500 font-medium'>
              שימו לב! מוצרים שכבר לא זמינים לקנייה (היו בעגלה אבל נקנו על ידי
              לקוח אחר) לא יוצגו בעגלה ולא תתבצע עבורם רכישה
            </Text>
          </Box>

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
        <View className='justify-center flex-1'>
          <Box>
            <Text className='text-xl text-center font-bold mb-2 text-red-500 p-8'>
              יש להוסיף אמצעי תשלום ראשון בדף הראשי על מנת לגשת לעגלה
            </Text>
          </Box>
        </View>
      )}
    </View>
  );
};

export default CartScreen;
