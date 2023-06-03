import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ActionButton = ({ title, handler, style }) => {
  return (
    <TouchableOpacity
      className='py-3 px-6 bg-[#3BABFE] rounded-xl items-center justify-center shadow-black self-stretch'
      onPress={() => {
        handler ? handler() : null;
      }}
      style={{elevation: 5 ,...style  }}
    >
      <Text className='text-white font-semibold'>{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
