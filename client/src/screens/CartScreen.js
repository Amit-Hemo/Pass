import React from 'react';
import { Text, View } from 'react-native';
import ProductsBillList from '.././components/ProductsBillList';
import ActionButton from '../components/ActionButton';
import useAuth from '../hooks/useAuth';
import useUserStore from '../stores/user';

const CartScreen = ({ navigation }) => {
  useAuth();

  const isCustomer = useUserStore((state) => state.isCustomer);
  const hasCreditCard = useUserStore((state) => state.hasCreditCard);

  return (
    <View className="mt-10 items-center">
      <Text className="mb-20 text-3xl  ">עגלת קניות</Text>
      {isCustomer && hasCreditCard ? (
        <View className="items-center">
          <View className="rounded-lg w-3/4 border-2">
            <View className="flex-row">
              <Text className="text-xl px-10 py-4 font-bold">
                מחיר
              </Text>
              <Text className="text-xl px-16 py-4 pb-5 font-bold">
                שם מוצר
              </Text>
            </View>

            <View className="h-80">
              <ProductsBillList />
            </View>
          </View>

          <View className="absolute top-2/3 mt-56 items-center">
            <Text>סך הכל 100 ש"ח</Text>
            <ActionButton
              title="מעבר לתשלום"
              handler={() => {
                navigation.navigate('Bill');
              }}
            />
          </View>
        </View>
      ) : (
        <View className="items-center border-2 rounded-xl mx-2">
          <Text className="text-xl text-center font-bold mb-2 text-red-500 p-10">
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
