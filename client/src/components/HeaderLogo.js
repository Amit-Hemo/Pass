import React from 'react';
import { Image } from 'react-native';

const HeaderLogo = () => {
  return (
    <Image
      source={require('../.././assets/header_logo2.png')}
      style={{ width: 110, height: 50 }}
    />
  );
};

export default HeaderLogo;
