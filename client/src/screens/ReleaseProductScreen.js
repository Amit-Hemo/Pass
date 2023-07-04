import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Dimensions, ScrollView, Text, ToastAndroid, View } from 'react-native';
import {
  HCESession,
  NFCTagType4,
  NFCTagType4NDEFContentType,
} from 'react-native-hce';
import ActionButton from '../components/ActionButton';
import Box from '../components/Box';

const ReleaseProductScreen = ({ navigation, route }) => {
  const { height } = Dimensions.get('window');
  const cart = route.params?.cart;
  const singleProduct = route.params?.singleProduct;
  
  let session;
  let HCERemoveListener;

  useFocusEffect(
    useCallback(() => {
      const startSession = async () => {
        const tag = new NFCTagType4({
          type: NFCTagType4NDEFContentType.Text,
          content: 'True password',
          writable: false,
        });
        
        session = await HCESession.getInstance();
        session.setApplication(tag);
        await session.setEnabled(true);
        console.log('Starting HCE session');

        HCERemoveListener = session.on(HCESession.Events.HCE_STATE_READ, () => {
          ToastAndroid.show("The tag has been read! Thank You.", ToastAndroid.LONG);
        });
      };

      startSession();
      return () => {
        const stopSession = async () => {
          console.log('Stopping HCE session');
          await session.setEnabled(false);
          HCERemoveListener()
        };
        stopSession();
      };
    }, [])
  );

  const productsToRelease = () => {
    if (singleProduct) {
      return (
        <View className='flex-row items-center justify-between'>
          <Text className='text-lg pl-20 py-1 font-bold'>
            {`${singleProduct?.name} - ${singleProduct?.size}`}{' '}
          </Text>
          <Text className='text-lg font-bold text-stone-600'>1</Text>
        </View>
      );
    } else {
      return cart?.map(({ product, tags }) => (
        <View
          className='flex-row items-center justify-between'
          key={product.sku}
        >
          <Text className='text-lg pl-20 py-1 font-bold'>{`${product.name} - ${product.size}`}</Text>
          <Text className='text-lg font-bold text-stone-600'>
            {tags.length}
          </Text>
        </View>
      ));
    }
  };

  return (
    <View className='items-center mt-10 px-7'>
      <Text className='text-2xl'>תתחדשו!</Text>
      <Text className='mt-5 mb-10 text-lg text-center'>
        הצמידו את הטלפון החכם לאטב לצורך שחרור המוצרים:
      </Text>

      <Box style={{ height: height / 3 + 30 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {productsToRelease()}
        </ScrollView>
      </Box>

      <ActionButton
        title='סיום'
        handler={() => {
          navigation.goBack();
          navigation.navigate('HomeScreen');
        }}
      />

      <Text className='mt-5 text-center text-sm'>
        במקרה של תהליך שחרור לא מוצלח, יש לפנות לעובד חנות
      </Text>
    </View>
  );
};

export default ReleaseProductScreen;
