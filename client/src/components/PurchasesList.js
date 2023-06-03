import React from 'react';
import { FlatList } from 'react-native';
import PurchaseItem from './PurchaseItem';

const PurchasesList = ({ purchases, navigation }) => {
  return (
    <FlatList
      data={purchases}
      renderItem={({ item, index }) => (
        <PurchaseItem {...item} index={index} navigation={navigation} />
      )}
      keyExtractor={(item) => item.transactionId}
    />
  );
};

export default PurchasesList;
