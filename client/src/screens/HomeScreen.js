import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import ActionButton from '../components/ActionButton';
import VideoBox from '../components/VideoBox';
import ScannedProductDetails from '../components/ScannedProductDetails';
import { setClearAuth } from '../stores/auth';
import useUserStore, {
  clearUser,
  setIsCustomer,
  setCardLastDigits,
  setHasCreditCard,
} from '../stores/user';
import { logoutUser } from '../api/user';
import useAuth from '../hooks/useAuth';
import {
  isBraintreeCustomer,
  createCustomer,
  generateClientToken,
  getPaymentMethod,
} from '../api/payment';
import OpenPaymentMethods from '../components/OpenPaymentMethods';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
import forcedLogout from '../utils/forcedLogout';

const HomeScreen = ({ navigation }) => {
  useAuth();

  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const [show, setShow] = useState(false);
  const [clientToken, setClientToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scannedProduct, setScannedProduct] = useState(null);

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-center font-bold mb-8 ">
          יש להמתין...
        </Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View className="items-center ">
      {isCustomer && hasCreditCard ? (
        <View className="items-center mt-6">
          <ActionButton
            title="לחץ לסריקת מוצר"
            handler={() => {
              navigation.navigate('ScanProduct');
            }}
          />
         
          <ScannedProductDetails  navigation={navigation}  />
          
        </View>
      ) : (
        <View className="items-center mt-4">
          <Text className="text-2xl mb-4">
            פעם ראשונה אצלנו ? הכנו סרטון הסבר
          </Text>

          <View className="border-2">
            <VideoBox
              uri={
                'https://res.cloudinary.com/dawvcozos/video/upload/v1682934904/Pass/instructions_gwz40s.mp4'
              }
            />
          </View>

          <Text className="text-2xl  mt-10">יש להוסיף אמצעי תשלום </Text>

          <TouchableOpacity
            className="items-center content-center w-40 mt-1 mb-1 rounded-2xl border-t-2 border-b-4  "
            onPress={() => {
              handleAddPaymentButton();
            }}
          >
            <Text className="text-lg ">בחירת אמצעי תשלום</Text>
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
          title="התנתקות"
          handler={async () => {
            try {
              const refreshToken = await SecureStore.getItemAsync(
                'refreshToken'
              );
              await logoutUser(refreshToken);
              await SecureStore.deleteItemAsync('accessToken');
              await SecureStore.deleteItemAsync('refreshToken');
              setClearAuth();
              clearUser();
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
