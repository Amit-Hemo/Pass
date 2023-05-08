import React from 'react';
import { FlatList } from 'react-native';
import PurchaseItem from './PurchaseItem';

const PurchasesList = ({ purchases }) => {
  return (
    <FlatList
      data={purchases}
      renderItem={({ item }) => (
        <PurchaseItem {...item}/>
      )}
      keyExtractor={(item) => item.transactionId}
    />
  );
};

export default PurchasesList;
