import { View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const VideoBox = ({ uri }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
        setIsPlaying(false);
      };
    }, [])
  );
  
  return (
    <View className="items-center ">
      <Video
        style={{ height: 350, width: 400 }}
        source={{
          uri,
        }}
        shouldPlay={isPlaying}
        isLooping={false}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        ref={videoRef}
      />
    </View>
  );
};

export default VideoBox;
