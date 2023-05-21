import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import useUserStore from '../stores/user';
import CartProduct from './CartProduct';

const ProductsBillList = ({ cart }) => {
  const [refreshing, setRefreshing] = useState(false);
  const uuid = useUserStore((state) => state.uuid);
  const queryClient = useQueryClient();

  const handleListRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries(['cart', uuid]);
    setRefreshing(false)
  }, []);

  return (
    <FlatList
      className='rounded-lg border-2 p-2 max-h-80'
      data={cart}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleListRefresh}
          colors={['#00B8D4', 'black']}
          progressBackgroundColor='#ffffff'
          title='טוען מחדש...'
          titleColor={'gray'}
          progressViewOffset={-40}
        />
      }
      renderItem={({ item }) => (
        <CartProduct
          price={item.product.price}
          name={item.product.name}
          size={item.product.size}
          quantity={item.quantity}
          tags={item.tags}
        />
      )}
      ListHeaderComponent={
        <View className='flex-row my-4'>
          <Text className='text-2xl font-bold w-5/12 text-center'>שם מוצר</Text>
          <Text className='text-2xl font-bold w-2/12 text-center'>כמות </Text>
          <Text className='text-2xl font-bold w-4/12 text-center'>מחיר</Text>
          <Text className='text-2xl font-bold w-1/12 text-center'></Text>
        </View>
      }
      stickyHeaderIndices={[0]}
      keyExtractor={(item) => item.product.sku}
    />
  );
};

export default ProductsBillList;
