import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const WelcomeScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      return () => {
        //cleanup animations
        exitPosition.value = 0;
      };
    }, [])
  );
  const exitPosition = useSharedValue(0);

  const btnExitingAnimatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      interpolate(exitPosition.value, [0, 1], [1, 0]),
      { duration: 100 }
    );
    const translateY = withTiming(
      interpolate(exitPosition.value, [0, 1], [0, 50]),
      { duration: 100 }
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View className='flex-1 items-center bg-[#3BABFE] justify-between'>
      <StatusBar />
      <View>
        <Image
          source={require('../../assets/header_logo2.png')}
          className='h-96 w-96'
        />
      </View>
      <View className={`justify-center w-full py-10`}>
        <Animated.View
          entering={FadeInDown.duration(100)}
          style={btnExitingAnimatedStyle}
        >
          <View className='px-7'>
            <TouchableOpacity
              className='bg-yellow-500 py-2 items-center justify-center rounded-3xl my-[20px]'
              onPress={() => {
                exitPosition.value = 1;
                setTimeout(() => navigation.navigate('Login'), 200);
              }}
            >
              <Text className='text-lg font-bold'>התחברות</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text className='text-center font-bold text-base my-[20px]'>
              משתמש חדש?{' '}
              <Text
                className='text-slate-50'
                onPress={() => {
                  exitPosition.value = 1;
                  setTimeout(() => navigation.navigate('CreateAccount'), 200);
                }}
              >
                להרשמה
              </Text>
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
