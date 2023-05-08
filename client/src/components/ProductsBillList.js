import React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import CartProduct from './CartProduct';

const ProductsBillList = ({ cart }) => {
  return (
    <View className='h-66'>
      <View>
        <FlatList
          data={cart}
          renderItem={({ item }) => (
            <CartProduct
              price={item.product.price}
              name={item.product.name}
              size={item.product.size}
              quantity={item.quantity}
              tags={item.tags}
            />
          )}
          keyExtractor={(item) => item.product.sku}
        />
      </View>
    </View>
  );
};

export default ProductsBillList;
