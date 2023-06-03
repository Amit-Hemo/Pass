import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const ProfileLink = ({ title, icon, to }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      className='flex-row justify-between items-center w-full space-x-3 py-1'
      onPress={() => navigation.navigate(to)}
    >
      <View className='flex-row items-center space-x-5 flex-1 '>
        {icon}
        <Text className='text-lg font-semibold'>{title}</Text>
      </View>
      <AntDesign
        name='left'
        size={20}
        color='gray'
      />
    </Pressable>
  );
};

export default ProfileLink;
