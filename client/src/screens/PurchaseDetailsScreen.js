import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { watchPurchaseById } from '../api/user';
import useAuth from '../hooks/useAuth';
import useUserStore from '../stores/user';

const PurchaseDetailsScreen = ({ route }) => {
  useAuth();
  const uuid = useUserStore((state) => state.uuid);
  const transactionId = route?.params?.id;
  const { data: foundPurchase, isLoading } = useQuery(
    ['purchaseDetails', uuid, transactionId],
    () => watchPurchaseById(uuid, transactionId),
    { select: (data) => data.foundPurchase, enabled: true }
  );

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
    <View className='items-center mt-10 px-7'>
      <Text className='mb-10 text-3xl'>פרטי רכישה</Text>
      <View className='self-end mb-5'>
        <Text className='mb-2 text-xl'>
          שם החנות: {foundPurchase?.merchantID}
        </Text>
        <Text className='mb-2 text-xl'>
          תאריך: {foundPurchase?.transactionTimeStamp.transactionDate}
        </Text>
        <Text className='mb-2 text-xl'>
          שעה: {foundPurchase?.transactionTimeStamp.transactionTime}
        </Text>
        <Text className='mb-2 text-xl'>
          סוג כרטיס: {foundPurchase?.cardType}
        </Text>
        <Text className='mb-2 text-xl'>
          ספרות אחרונות: {foundPurchase?.last4}
        </Text>
        <Text className='mb-2 text-xl'>
          מספר עסקה: {foundPurchase?.transactionId}
        </Text>
      </View>

      <View className='rounded-lg border-2 px-2 mb-4'>
        <View className='flex-row-reverse w-full my-4'>
          <Text className='text-2xl font-bold w-5/12 text-center'>פריט</Text>
          <Text className='text-2xl font-bold w-3/12 text-center'>כמות </Text>
          <Text className='text-2xl font-bold w-4/12 text-center'>מחיר</Text>
        </View>
        <View className='h-60'>
          <FlatList
            data={foundPurchase?.products}
            renderItem={({ item }) => (
              <View className='flex-row-reverse mb-2'>
                <Text className='text-xl w-5/12 text-center'>
                  {`${item.product.name} ${item.product.size}`}
                </Text>
                <Text className='text-xl w-3/12 text-center'>{item.quantity}</Text>
                <Text className='text-xl w-4/12 text-center'>{item.quantity * item.product.price} ש"ח</Text>
              </View>
            )}
            keyExtractor={(item) => item.product.sku}
          />
        </View>
      </View>
      <Text className='text-xl'>סך הכל {foundPurchase?.totalAmount} ש"ח</Text>
    </View>
  );
};

export default PurchaseDetailsScreen;
