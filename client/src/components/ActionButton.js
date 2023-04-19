import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ActionButton = ({ title, handler }) => {
  return (
    <TouchableOpacity
      className='items-center content-center w-40 mt-5 mb-1 rounded-2xl border-t-2 border-b-4  '
      onPress={() => {
        handler ? handler() : null;
      }}
    >
      <Text className='text-lg '>{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
