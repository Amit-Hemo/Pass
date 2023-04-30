import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { View } from 'react-native';
import ActionButton from '../components/ActionButton';
import ScannedProductDetails from '../components/ScannedProductDetails';
import { setClearAuth } from '../stores/auth';
import { clearUser } from '../stores/user';
import { logoutUser } from '../api/user';
import useAuth from '../hooks/useAuth';

const HomeScreen = ({ navigation }) => {
  useAuth();
  return (
    <View className="items-center mt-4">
      <ActionButton
        title="לחץ לסריקת מוצר"
        handler={() => {
          navigation.navigate('ScanProduct');
        }}
      />

      {/* In that part we will need to return the ID from the scanned RFID and send it to the DB.
       send it to ScannedProductDetails */}
      {/* Product details component */}
      <ScannedProductDetails productID="1" navigation={navigation} />
      <ActionButton
        title="התנתקות"
        handler={async () => {
          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            await logoutUser(refreshToken);
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            clearUser();
            setClearAuth();
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </View>
  );
};

export default HomeScreen;
