import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const GoogleButton = ({ handler, disabled }) => {
  return (
    <View className='rounded w-full'>
      <TouchableOpacity
        disabled={disabled}
        onPress={handler}
        className='py-2 bg-white items-center border border-slate-300 flex-row w-full'
        style={{ elevation: 2, borderRadius: 40 }}
      >
        <View className='ml-4 justify-self-start'>
          <Image
            source={require('../../assets/google.png')}
            className='h-6 w-6'
          />
        </View>
        <Text className='text-lg flex-1 font-bold mr-10 text-center'>
          המשך עם גוגל
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleButton;
