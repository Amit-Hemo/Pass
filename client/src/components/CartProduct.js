import React from 'react'
import { View, Text } from 'react-native'

const CartProduct = ({name, size, price, quantity}) => {
  return (
    <View className='flex-row-reverse items-center'>
      <Text className='text-xl text-center w-3/6 mb-2'>{name} - {size}</Text>
      <Text className='text-xl text-center w-1/6 mb-2'>{quantity}</Text>
      <Text className='text-xl text-center w-2/6 mb-2'>{price} ש"ח</Text>
    </View>
  )
}

export default CartProduct