import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ActionButton = ({ title, handler }) => {
  return (
    <TouchableOpacity
      className="py-3 px-6 mb-6 mx-2 bg-blue-400 rounded-lg items-center justify-center shadow-black"
      onPress={() => {
        handler ? handler() : null;
      }}
      style={{ elevation: 5 }}
    >
      <Text className="text-white font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
