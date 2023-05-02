import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as paymentAPI from '../api/payment';
import ProductsBillList from '../components/ProductsBillList';
import useAuth from '../hooks/useAuth';

// The Screen should match a quick purchase  (1 product) but also a Flat list of products comes from the Cart
//
const BillScreen = ({ productName, price, navigation }) => {
  useAuth();
  
  const [user, setUser] = useState({
    userId: '1234',
    firstName: 'Albert',
    lastName: 'Einstein',
    payment: {
      customerId: '82936746549',
    },
  });

  const makeTransaction = async () => {
    const { customerId } = user.payment;
    try {
      //should be user.userId when we get mongo and customerId will be stored securely in the server
      const { data } = await paymentAPI.makeTransaction(customerId);
      navigation.navigate('Release');
      console.log('====================================');
      console.log(data.result);
      console.log('====================================');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="items-center mt-10">
      <Text className="mb-20 text-3xl">פרטי תשלום</Text>
      {/* We need to find a way to save the name and the price of the product and use it here, Maybe send it as a prop..
    The Problem is that we get here from button press action and its directly take us to here */}

      <View className="rounded-lg w-3/4 h-2/3 border-2">
        <View className="flex-row">
          <Text className="text-xl px-10 py-4 font-bold">מחיר</Text>
          <Text className="text-xl px-16 py-4 pb-5 font-bold">
            שם מוצר
          </Text>
        </View>
        <ScrollView>
          <ProductsBillList />
        </ScrollView>
      </View>

      <View className="absolute top-2/3 mt-40 items-center">
        <View>
          <Text className="text-xl">סך הכל 100 ש"ח</Text>
        </View>
      </View>
      <TouchableOpacity
        className="items-center content-center w-40 mt-1 mb-1 rounded-2xl border-t-2 border-b-4  "
        onPress={makeTransaction}
      >
        <Text className="text-lg ">תשלום</Text>
      </TouchableOpacity>
      {/* need to sum the prices */}
    </View>
  );
};

export default BillScreen;
