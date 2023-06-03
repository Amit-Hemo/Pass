import React from 'react';
import { View } from 'react-native';

const Box = ({ children, style }) => {
  return (
    <View
      className='px-4 bg-white rounded-2xl items-center w-full mb-3'
      style={{
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: 'gray',
        elevation: 5,
        paddingVertical: 15,
        ...style
      }}
    >
      {children}
    </View>
  );
};

export default Box;
