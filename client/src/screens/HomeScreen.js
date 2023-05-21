import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import {
  createCustomer,
  generateClientToken,
  getPaymentMethod,
  isBraintreeCustomer,
} from '../api/payment';
import { logoutUser } from '../api/user';
import ActionButton from '../components/ActionButton';
import OpenPaymentMethods from '../components/OpenPaymentMethods';
import Popup from '../components/Popup';
import ScannedProductDetails from '../components/ScannedProductDetails';
import VideoBox from '../components/VideoBox';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import { setClearAuth } from '../stores/auth';
import useUserStore, {
  clearUser,
  setCardLastDigits,
  setHasCreditCard,
  setIsCustomer,
} from '../stores/user';
import forcedLogout from '../utils/forcedLogout';
import useProductStore, { setScanned } from '../stores/product';

const HomeScreen = ({ navigation }) => {
  useAuth();
  
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const [show, setShow] = useState(false);
  const [clientToken, setClientToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const uuid = useUserStore((state) => state.uuid);
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const email = useUserStore((state) => state.email);
  const isCustomer = useUserStore((state) => state.isCustomer);
  const hasCreditCard = useUserStore((state) => state.hasCreditCard);

  const scannedProduct = useProductStore((state) => state.scanned);


  useEffect(() => {
    const checkValidCustomer = async () => {
      try {
        setIsLoading(true);
        const { data: response } = await isBraintreeCustomer(uuid);
        const { isBraintreeCustomer: braintreeCustomerExist } = response;
        setIsCustomer(braintreeCustomerExist);

        if (braintreeCustomerExist) {
          const { data } = await getPaymentMethod(uuid);
          const { firstMethod } = data;

          if (firstMethod) {
            const { last4 } = firstMethod;
            setCardLastDigits(last4);
            setHasCreditCard(true);
          }
        }
      } catch (error) {
        await forcedLogout();
        console.log(error);
      }
      setIsLoading(false);
    };
    checkValidCustomer();
  }, []);

  const handleAddPaymentButton = async () => {
    setIsLoading(true);

    try {
      if (!isCustomer) {
        await createCustomer({
          uuid,
          firstName,
          lastName,
          email,
        });
        setIsCustomer(true);
      }

      const { data } = await generateClientToken(uuid);
      const { clientToken } = data;
      setClientToken(clientToken);
      setShow(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setModalInfo({
        isError: true,
        message: 'שגיאה בשירות התשלום, יש לנסות מאוחר יותר',
      });
      setModalVisible(true);
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      await logoutUser(refreshToken);
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      setClearAuth();
      if(scannedProduct) setScanned(false)
      clearUser();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-xl text-center font-bold mb-8 '>
          יש להמתין...
        </Text>
        <ActivityIndicator size='large' />
      </View>
    );
  }
  return (
    <View className='items-center px-7'>
      {isCustomer && hasCreditCard ? (
        <View className='items-center mt-16'>
          <ActionButton
            title='לחץ לסריקת מוצר'
            handler={() => {
              navigation.navigate('ScanProduct');
            }}
          />

          <ScannedProductDetails navigation={navigation} />
        </View>
      ) : (
        <View className='items-center mt-10'>
          <Text className='text-2xl mb-4'>
            פעם ראשונה אצלנו ? הכנו סרטון הסבר
          </Text>

          <View className='mb-8 border-2 rounded-md'>
            <VideoBox
              uri={
                'https://res.cloudinary.com/dawvcozos/video/upload/v1682934904/Pass/instructions_gwz40s.mp4'
              }
            />
          </View>

          <Text className='text-xl mb-4 text-red-500'>יש להוסיף אמצעי תשלום כדי להתחיל בקנייה</Text>

          <TouchableOpacity
            className='items-center content-center my-1 rounded-2xl border-t-2 border-b-4 px-4'
            onPress={() => {
              handleAddPaymentButton();
            }}
          >
            <Text className='text-lg '>בחירת אמצעי תשלום</Text>
          </TouchableOpacity>
        </View>
      )}

      <Popup
        visible={modalVisible}
        isError={modalInfo.isError}
        setVisible={setModalVisible}
        onClose={modalInfo.onClose}
        message={modalInfo.message}
      />

      <OpenPaymentMethods
        clientToken={clientToken}
        show={show}
        setShow={setShow}
      />

      <View>
        <ActionButton
          title='התנתקות'
          handler={handleLogout}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
