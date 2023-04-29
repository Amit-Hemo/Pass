import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { View } from 'react-native';
import ActionButton from '../components/ActionButton';
import ScannedProductDetails from '../components/ScannedProductDetails';
import { setAccessToken, setIsLoggedIn } from '../stores/auth';
import { clearUser } from '../stores/user';

const HomeScreen = ({ navigation }) => {

  return (
    <View className='items-center mt-4'>
      <ActionButton
        title='לחץ לסריקת מוצר'
        handler={() => {
          navigation.navigate('ScanProduct');
        }}
      />

      {/* In that part we will need to return the ID from the scanned RFID and send it to the DB.
       send it to ScannedProductDetails */}
      {/* Product details component */}
      <ScannedProductDetails
        productID='1'
        navigation={navigation}
      />
      <ActionButton
        title='התנתקות'
        handler={async () => {
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          //TODO: call the server to logout
          clearUser()
          setAccessToken('')
          setIsLoggedIn(false)
        }}
      />
    </View>
  );
};

export default HomeScreen;
