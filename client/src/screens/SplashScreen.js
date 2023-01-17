import { Video } from "expo-av";
import video from "../.././assets/splash_video.mp4";
import { View } from "react-native";
import React, { useEffect } from "react";

const SplashScreen = ({ navigation }) => {
  // Auto navigate to home screen after x seconds

  useEffect(() => {
    const timeOut = setTimeout(() => {
      navigation.navigate("Login");
    }, 4000);
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <View className="h-full flex-col items-center justify-center bottom-20">
      <Video
        style={{ height: 300, width: 320 }}
        source={video}
        shouldPlay
        isLooping
      />
    </View>
  );
};

export default SplashScreen;
