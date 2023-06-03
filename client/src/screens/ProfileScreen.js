import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { generateClientToken } from '../api/payment';
import { logoutUser } from '../api/user';
import ActionButton from '../components/ActionButton';
import Box from '../components/Box';
import CreditCard from '../components/CreditCard';
import HorizonalLine from '../components/HorizonalLine';
import OpenPaymentMethods from '../components/OpenPaymentMethods';
import Popup from '../components/Popup';
import ProfileLink from '../components/ProfileLink';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import useAuthStore, { setClearAuth } from '../stores/auth';
import useProductStore, { setScanned } from '../stores/product';
import useUserStore, { clearUser } from '../stores/user';

const ProfileScreen = ({ navigation }) => {
  useAuth();

  const [clientToken, setClientToken] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const uuid = useUserStore((state) => state.uuid);
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const email = useUserStore((state) => state.email);
  const isCustomer = useUserStore((state) => state.isCustomer);
  const hasCreditCard = useUserStore((state) => state.hasCreditCard);

  const isSignedWithProvider = useAuthStore(
    (state) => state.isSignedWithProvider
  );

  const scannedProduct = useProductStore((state) => state.scanned);

  const handleAddPaymentButton = async () => {
    setIsLoading(true);
    try {
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
      await SecureStore.deleteItemAsync('signedWithProvider');
      setClearAuth();
      if (scannedProduct) setScanned(false);
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
    <ScrollView>
      <View className='items-center mt-5 px-7'>
        <Box>
          <Pressable
            className='flex-row justify-between items-center w-full'
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View>
              <Text className='text-xl font-bold'>
                {firstName} {lastName}
              </Text>
              <Text className='text-lg font-bold text-gray-500'>{email}</Text>
            </View>

            <AntDesign
              name='left'
              size={20}
              color='gray'
            />
          </Pressable>
        </Box>

        <Box style={{ justifyContent: 'center' }}>
          {isCustomer && hasCreditCard ? (
            <>
              <CreditCard />
              <ActionButton
                title='בחירת אמצעי תשלום'
                handler={() => {
                  handleAddPaymentButton();
                }}
                style={{ marginTop: 20 }}
              />
            </>
          ) : (
            <Text className='text-lg text-center font-bold mb-2 text-red-500'>
              קיימות אפשרויות נוספות בעמוד זה לאחר הוספת אמצעי תשלום ראשוני
              בעמוד הראשי
            </Text>
          )}
        </Box>

        <Box style={{ justifyContent: 'center' }}>
          {!isSignedWithProvider && (
            <>
              <ProfileLink
                title='סיסמא'
                icon={
                  <AntDesign
                    name='lock'
                    size={28}
                    color='black'
                  />
                }
                to='UpdatePassword'
              />
              <HorizonalLine />
            </>
          )}

          {isCustomer && hasCreditCard && (
            <>
              <ProfileLink
                title='היסטורית רכישות'
                icon={
                  <MaterialIcons
                    name='history'
                    size={28}
                    color='black'
                  />
                }
                to='PurchasesHistory'
              />
              <HorizonalLine />
            </>
          )}
          <View className='self-stretch mt-4'>
            <TouchableOpacity
              className='bg-yellow-400 py-2 px-6 flex-row items-center justify-center space-x-3 shadow-md shadow-gray-600'
              onPress={handleLogout}
              style={{ borderRadius: 10 }}
            >
              <MaterialIcons
                name='logout'
                size={24}
                color='white'
              />
              <Text className='text-base font-semibold text-white'>
                התנתקות
              </Text>
            </TouchableOpacity>
          </View>
        </Box>

        <OpenPaymentMethods
          clientToken={clientToken}
          show={show}
          setShow={setShow}
          setIsLoading={setIsLoading}
        />
        <Popup
          visible={modalVisible}
          isError={modalInfo.isError}
          setVisible={setModalVisible}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
