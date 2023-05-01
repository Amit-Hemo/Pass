import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import ActionButton from '../components/ActionButton';
import VideoBox from '../components/VideoBox';
import ScannedProductDetails from '../components/ScannedProductDetails';
import { setClearAuth } from '../stores/auth';
import useUserStore, { clearUser } from '../stores/user';
import { logoutUser } from '../api/user';
import useAuth from '../hooks/useAuth';
import { isBraintreeCustomer } from '../api/payment';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  useAuth();
  const [isCustomer, setIsCustomer] = useState(false);
  const uuid = useUserStore((state) => state.uuid);
  console.log(useUserStore((state) => state.uuid));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const customerCheck = async () => {
        try {
          const { data } = await isBraintreeCustomer(uuid);
          const isCustomer = data.isBraintreeCustomer;
          if (isActive) setIsCustomer(isCustomer);
        } catch (error) {
          console.log(error);
        }
      };
      customerCheck();

      return () => {
        isActive = false;
      };
    }, [uuid])
  );

  return (
    <View className="items-center mt-4">
      {isCustomer ? (
        <View className="items-center mt-4">
          <ActionButton
            title="לחץ לסריקת מוצר"
            handler={() => {
              navigation.navigate('ScanProduct');
            }}
          />

          <ScannedProductDetails productID="1" navigation={navigation} />
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
          <ActionButton title="הוספת אמצעי תשלום" />
        </View>
      )}

      <View className="mt-10">
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
