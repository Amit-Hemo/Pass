import React from 'react';
import { Pressable, Text, View } from 'react-native';

const PurchaseItem = ({
  transactionId,
  merchantID,
  totalAmount,
  transactionTimeStamp,
  navigation,
}) => {
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('PurchaseDetails', { id: transactionId })
      }
      className='mb-4'
    >
      <View className='flex-row items-center bg-blue-50 rounded-lg p-1'>
        <Text className='text-lg text-center mb-2 w-5/12'>{merchantID}</Text>
        <Text className='text-lg text-center mb-2 w-4/12'>
          {totalAmount} ש"ח
        </Text>
        <Text className='text-lg text-center mb-2 w-3/12'>
          {transactionTimeStamp.transactionDate}
        </Text>
      </View>
    </Pressable>
  );
};

export default PurchaseItem;
