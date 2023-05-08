import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { watchPurchases } from '../api/user';
import PurchasesList from '../components/PurchasesList';
import useAuth from '../hooks/useAuth';
import useUserStore from '../stores/user';

const PurchasesHistoryScreen = () => {
  useAuth();
  const uuid = useUserStore((state) => state.uuid);
  const { data: purchases } = useQuery(['purchases', uuid], () => watchPurchases(uuid), {
    select: (data) => [...data.purchases].reverse(),
  });

  return (
    <View className='items-center mt-10'>
      <Text className='mb-20 text-3xl'>היסטורית רכישות </Text>
      <View className='items-center px-7'>
        <View className='rounded-lg border-2 px-2 pb-4'>
          <View className='flex-row-reverse w-full my-4'>
            <Text className='text-2xl font-bold w-5/12 text-center'>
              שם החנות
            </Text>
            <Text className='text-2xl font-bold w-4/12 text-center'>
              סה"כ שולם
            </Text>
            <Text className='text-2xl font-bold w-3/12 text-center'>תאריך</Text>
          </View>

          <View className='h-80'>
            <PurchasesList purchases={purchases} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PurchasesHistoryScreen;
