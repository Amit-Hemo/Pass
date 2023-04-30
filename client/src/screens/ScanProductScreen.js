import React from 'react';
import { Text, View } from 'react-native';
import { Video } from 'expo-av';
import video from '../.././assets/scan_video.mp4';
import useAuth from '../hooks/useAuth';

const ScanProductScreen = ({ navigation }) => {
  useAuth();
  return (
    <View className="items-center border-1 mt-10">
      <Text className="text-base text-3xl">הצמד את הטלפון החכם לאטב</Text>
      <View className="h-full flex-col items-center justify-center bottom-20">
        <Video
          style={{ height: 350, width: 400 }}
          source={video}
          shouldPlay
          isLooping
        />
      </View>
    </View>
  );
};

{
  /* In that part we will need to return the ID from the scanned RFID and send it details to Home */
}

export default ScanProductScreen;
