import React from 'react';
import { Image, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useUserStore from '../stores/user';

const CreditCard = () => {
  const lastDigits = useUserStore((state) => state.cardLastDigits);
  const cardType = useUserStore((state) => state.cardType);

  const cardTypeToImageUrl = {
    visa: require('../../assets/visa.png'),
    mastercard: require('../../assets/mastercard.png'),
  };

  return (
    <LinearGradient
      colors={['rgba(200,200,200, 1)', 'rgba(250,250,250,1)']}
      useAngle
      angle={225}
      angleCenter={{ x: 0.5, y: 0.5 }}
      className='rounded-lg shadow-xl shadow-black'
    >
      <View className='p-5 h-[150] relative'>
        <Text className='mb-4 text-lg font-semibold'>כרטיס ראשי</Text>
        <Text className='text-lg font-bold tracking-widest text-gray-700'>
          {`XXXX-XXXX-XXXX-${lastDigits}`}
        </Text>
        <Image
          source={cardTypeToImageUrl[cardType.toLowerCase()]}
          style={{
            width: 45,
            height: 37,
            position: 'absolute',
            bottom: 1,
            left: 20,
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default CreditCard;
