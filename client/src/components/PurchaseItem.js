import React from 'react';
import { View, Text } from 'react-native';

const PurchaseItem = ({merchantID, totalAmount, transactionTimeStamp}) => {
  return (
    <View className='flex-row-reverse items-center'>
      <Text className='text-lg text-center mb-2 w-5/12'>{merchantID}</Text>
      <Text className='text-lg text-center mb-2 w-4/12'>
        {totalAmount} ש"ח
      </Text>
      <Text className='text-lg text-center mb-2 w-3/12'>
        {transactionTimeStamp.transactionDate}
      </Text>
    </View>
  );
};

export default PurchaseItem;
