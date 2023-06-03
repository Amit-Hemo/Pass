import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { watchPurchases } from '../api/user';
import PurchasesList from '../components/PurchasesList';
import useAuth from '../hooks/useAuth';
import useUserStore from '../stores/user';

const PurchasesHistoryScreen = ({ navigation }) => {
  useAuth();
  const uuid = useUserStore((state) => state.uuid);
  const { data: purchases, isLoading } = useQuery(
    ['purchases', uuid],
    () => watchPurchases(uuid),
    {
      select: (data) => [...data.purchases].reverse(),
    }
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
    <View className='items-center flex-1 px-7 mt-16'>
      {purchases?.length > 0 ? (
        <View className='h-[550] w-full'>
          <PurchasesList
            purchases={purchases}
            navigation={navigation}
          />
        </View>
      ) : (
        <View className='h-[400] justify-center'>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1685791103/Pass/E9CBE002-2399-4828-90C5-6A4F4B8EEE1C_y39zkm.png',
              width: 200,
              height: 200,
            }}
            style={{ marginStart: 5 }}
          />
          <Text className='text-xl font-bold mt-10'>היסטורית הרכישות ריקה</Text>
        </View>
      )}
    </View>
  );
};

export default PurchasesHistoryScreen;
