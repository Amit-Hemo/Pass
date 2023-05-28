import { Video } from 'expo-av';
import { View } from 'react-native';
import React, { useEffect } from 'react';

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
    <View className="h-full flex-col items-center justify-center bottom-20">
      <Video
        style={{ height: 300, width: 320 }}
        source={{
          uri: 'https://res.cloudinary.com/dawvcozos/video/upload/v1682935510/Pass/splash_video_ymfvkq.mp4',
        }}
        shouldPlay
        isLooping
      />
    </View>
  );
};

export default SplashScreen;
