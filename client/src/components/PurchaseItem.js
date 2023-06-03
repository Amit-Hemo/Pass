import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Box from './Box';

const PurchaseItem = ({
  transactionId,
  merchantID,
  totalAmount,
  transactionTimeStamp,
  navigation,
  index,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(index * 150).duration(200)}>
      <Box style={{ elevation: 0, shadowOpacity: 0 }}>
        <Pressable
          onPress={() =>
            navigation.navigate('PurchaseDetails', { id: transactionId })
          }
          className='w-full'
        >
          <View className='flex-row items-center justify-between'>
            <View>
              <Text className='text-lg font-medium'>{merchantID}</Text>
              <Text className='text-base self-start text-gray-500 font-medium'>
                {transactionTimeStamp.transactionDate}
              </Text>
            </View>
            <Text className='text-lg text-yellow-600 font-medium'>
              {totalAmount} ש"ח
            </Text>
          </View>
        </Pressable>
      </Box>
    </Animated.View>
  );
};

export default PurchaseItem;
