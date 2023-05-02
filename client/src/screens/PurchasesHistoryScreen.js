import React from 'react';
import { Text, View } from 'react-native';
import useAuth from '../hooks/useAuth';

const PurchasesHistoryScreen = () => {
  useAuth();

  return (
    <View className="items-center mt-10">
      <Text className="mb-20 text-3xl">היסטורית רכישות </Text>
    </View>
  );
};

export default PurchasesHistoryScreen;
