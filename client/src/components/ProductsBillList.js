import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { Dimensions, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useUserStore from '../stores/user';
import CartProduct from './CartProduct';

const ProductsBillList = ({ cart }) => {
  const [refreshing, setRefreshing] = useState(false);
  const uuid = useUserStore((state) => state.uuid);
  const queryClient = useQueryClient();
  const { height } = Dimensions.get('window');

  const handleListRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries(['cart', uuid]);
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
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
      style={{ height: height / 3 + 30 }}
    >
      {cart?.map(({ product, quantity, tags }) => (
        <CartProduct
          price={product.price}
          name={product.name}
          size={product.size}
          quantity={quantity}
          tags={tags}
          key={product.sku}
        />
      ))}
    </ScrollView>
  );
};

export default ProductsBillList;
