import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { watchCart } from '../api/user';
import useProductStore from '../stores/product';
import useUserStore from '../stores/user';
import countCartAmount from '../utils/countCartAmount';
import filterUnavailableTags from '../utils/filterUnavailableTags';

const ReleaseProductScreen = ({ navigation, route }) => {
  const isScanned = useProductStore((state) => state.scanned);
  const name = useProductStore((state) => state.name);
  const size = useProductStore((state) => state.size);
  const uuid = useUserStore((state) => state.uuid);
  const cart = route.params?.cart

  //TODO: after finishing releasing, cart/scanned product must be removed!!!

  const productsToRelease = () => {
    if (isScanned) {
      return (
        <View className='flex-row items-center justify-between'>
          <Text className='text-xl pl-20 py-4'>{`${name} - ${size}`} </Text>
          <Text className='text-xl font-bold text-stone-600'>1</Text>
        </View>
      );
    } else {
      return cart?.map(({ product, tags }) => (
        <View
          className='flex-row items-center justify-between'
          key={product.sku}
        >
          <Text className='text-xl pl-20 py-4 font-bold'>{`${product.name} - ${product.size}`}</Text>
          <Text className='text-xl font-bold text-stone-600'>
            {tags.length}
          </Text>
        </View>
      ));
    }
  };

  let cartAmount = 0;
  if (cart) {
    cartAmount = countCartAmount(cart);
  }

  return (
    <View className='items-center mt-10 px-7'>
      <Text className='text-3xl'>תתחדשו!</Text>
      <Text className='mt-5 mb-20 text-xl'>
        הצמידו את הטלפון החכם לאטב לצורך שחרורו
      </Text>

      <View className='border-2 rounded-lg h-3/6 items-center mb-2 px-4'>
        <ScrollView>{productsToRelease()}</ScrollView>
      </View>

      {/* List len will be how many products , each release will reduce this number by 1 */}
      <Text className='font-bold text-xl px-10'>
        נותרו עוד {isScanned ? 1 : cartAmount} מוצרים לשחרור
      </Text>
    </View>
  );
};

export default ReleaseProductScreen;
