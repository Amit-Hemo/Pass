import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import {
  createCustomer,
  generateClientToken,
  getPaymentMethod,
  isBraintreeCustomer,
} from '../api/payment';
import ActionButton from '../components/ActionButton';
import OpenPaymentMethods from '../components/OpenPaymentMethods';
import Popup from '../components/Popup';
import ScannedProductDetails from '../components/ScannedProductDetails';
import VideoBox from '../components/VideoBox';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import useUserStore, {
  setCardLastDigits,
  setCardType,
  setHasCreditCard,
  setIsCustomer,
} from '../stores/user';
import forcedLogout from '../utils/forcedLogout';

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

  useEffect(() => {
    const checkValidCustomer = async () => {
      try {
        setIsLoading(true);
        const { data: response } = await isBraintreeCustomer(uuid);
        const { isBraintreeCustomer: braintreeCustomerExist } = response;
        setIsCustomer(braintreeCustomerExist);

        if (braintreeCustomerExist) {
          const { data } = await getPaymentMethod(uuid);
          const { defaultPaymentMethod } = data;

          if (defaultPaymentMethod) {
            const { last4, cardType } = defaultPaymentMethod;
            setCardLastDigits(last4);
            setCardType(cardType);
            setHasCreditCard(true);
          }
        }
      } catch (error) {
        if (
          error?.response?.data?.error !== 'default payment method not found'
        ) {
          await forcedLogout();
        }
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
    <View className='flex-1'>
      <StatusBar backgroundColor='#3BABFE' />

      <View className='flex-1 items-center px-7'>
        {isCustomer && hasCreditCard ? (
          <View className='items-center mt-10 w-full'>
            <ScannedProductDetails navigation={navigation} />
            <View className='w-full'>
              <TouchableOpacity
                className='bg-yellow-400 py-3 px-6 items-center justify-center shadow-black mt-5'
                onPress={() => navigation.navigate('ScanProduct')}
                style={{ borderRadius: 10, elevation: 5 }}
              >
                <Text className='text-lg font-semibold text-white'>
                  לחץ לסריקת מוצר
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className='items-center mt-10 w-full'>
            <Text className='text-2xl mb-4 font-bold'>שלום {firstName},</Text>
            <Text className='text-lg'>הכנו עבורך סרטון הסבר לשימוש ב-PASS</Text>
            <View className='mb-8 rounded-md'>
              <VideoBox
                uri={
                  'https://res.cloudinary.com/dawvcozos/video/upload/v1685628347/Pass/instructions_gwz40s_bdybjn.mp4'
                }
              />
            </View>
            <Text className='text-base font-bold mb-4 text-yellow-500'>
              יש להוסיף אמצעי תשלום כדי להתחיל בקנייה
            </Text>
            <ActionButton
              handler={() => {
                handleAddPaymentButton();
              }}
              title='בחירת אמצעי תשלום'
              style={{ alignSelf: 'stretch' }}
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

      {show && (
        <OpenPaymentMethods
          clientToken={clientToken}
          show={show}
          setShow={setShow}
          setIsLoading={setIsLoading}
        />
      )}
    </View>
  );
};

export default HomeScreen;
