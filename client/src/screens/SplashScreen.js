import { Video } from 'expo-av';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

const SplashScreen = ({ navigation }) => {
  // Auto navigate to home screen after x seconds

  useEffect(() => {
    const timeOut = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 4000);
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <View className='flex-1 items-center justify-center'>
      <Video
        style={{ height: 300, width: 300}}
        source={require('../../assets/splash.mp4')}
        shouldPlay
        isLooping
        resizeMode='contain'
      />
    </View>
  );
};

export default SplashScreen;
