import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import useProductStore from '../stores/product';
import useUserStore from '../stores/user';
import { watchCart } from '../api/user';

// Here we will have to bring the product list from  ProductBillList component
const ReleaseProductScreen = ({ navigation }) => {
  const isScanned = useProductStore((state) => state.scanned);
  const name = useProductStore((state) => state.name);
  const size = useProductStore((state) => state.size);
  const uuid = useUserStore((state) => state.uuid)
  const { data } = useQuery(['cart', uuid], () => watchCart(uuid));

  const productsToRelease = () => {
    if (isScanned) {
      return (
        <Text className='text-xl px-10 py-4'>{`${name} - ${size}`} </Text>
      );
    } else {
      return data?.cart?.map(({product}) => (
        <Text className='text-xl px-10 py-4' key={product.sku}>{`${product.name} - ${product.size}`}</Text>
      ));
    }
  };

  return (
    <View className='items-center mt-10'>
      <Text className='text-3xl'>תתחדשו!</Text>
      <Text className='mt-5 mb-20 text-xl'>
        הצמידו את הטלפון החכם לאטב לצורך שחרורו
      </Text>

      <View className='border-2 rounded-lg h-3/5 w-3/4 items-center'>
        <ScrollView>
          {productsToRelease()}
        </ScrollView>
      </View>

      {/* List len will be how many products , each release will reduce this number by 1 */}
      <Text className='font-bold text-xl px-10'>נותרו עוד {isScanned ? 1 : data?.cart?.length} מוצרים לשחרור</Text>
    </View>
  );
};

export default ReleaseProductScreen;
