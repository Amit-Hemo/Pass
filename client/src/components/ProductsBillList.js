import React from 'react';
import { FlatList, View } from 'react-native';
import CartProduct from './CartProduct';

const ProductsBillList = ({ cart }) => {
  return (
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
  );
};

export default ProductsBillList;
