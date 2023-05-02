import React from 'react';
import { View, ScrollView } from 'react-native';
import ProductBillDetails from './ProductBillDetails';

const ProductsBillList = () => {
  return (
    <View className="h-66">
      {/* That should be that list of products */}
      <ScrollView>
        <ProductBillDetails productName="חולצה לבנה" price="100" />
        <ProductBillDetails productName="חולצה לבנה" price="100" />
        <ProductBillDetails productName="חולצה לבנה" price="100" />
        <ProductBillDetails productName="חולצה לבנה" price="100" />
        <ProductBillDetails productName="חולצה לבנה" price="100" />
        <ProductBillDetails productName="חולצה לבנה" price="100" />
        <ProductBillDetails productName="חולצה לבנה" price="100" />
      </ScrollView>
    </View>
  );
};

export default ProductsBillList;
