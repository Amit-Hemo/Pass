import { useFocusEffect } from '@react-navigation/native';
import { ResizeMode, Video } from 'expo-av';
import React, { useCallback, useRef, useState } from 'react';

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
    <Video
      style={{
        height: 200,
        width: 300,
        borderRadius: 10,
      }}
      source={{
        uri,
      }}
      shouldPlay={isPlaying}
      isLooping={false}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
      ref={videoRef}
    />
  );
};

export default VideoBox;
