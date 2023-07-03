import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import Box from '../components/Box';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
import useUserStore from '../stores/user';

const ReleaseProductScreen = ({ navigation, route }) => {
  const uuid = useUserStore((state) => state.uuid);
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  

  const { height } = Dimensions.get('window');
  const cart = route.params?.cart;
  const singleProduct = route.params?.singleProduct


  const clearProducts = () => {

    //cart
    
      // clearCartMutation.mutate(uuid);
    
  };

  const productsToRelease = () => {
    if (singleProduct) {
      return (
        <View className='flex-row items-center justify-between'>
          <Text className='text-lg pl-20 py-1 font-bold'>{`${singleProduct?.name} - ${singleProduct?.size}`} </Text>
          <Text className='text-lg font-bold text-stone-600'>1</Text>
        </View>
      );
    } else {
      return cart?.map(({ product, tags }) => (
        <View
          className='flex-row items-center justify-between'
          key={product.sku}
        >
          <Text className='text-lg pl-20 py-1 font-bold'>{`${product.name} - ${product.size}`}</Text>
          <Text className='text-lg font-bold text-stone-600'>
            {tags.length}
          </Text>
        </View>
      ));
    }
  };

  return (
    <View className='items-center mt-10 px-7'>
      <Text className='text-2xl'>תתחדשו!</Text>
      <Text className='mt-5 mb-10 text-lg text-center'>
        הצמידו את הטלפון החכם לאטב לצורך שחרור המוצרים:
      </Text>

      <Box style={{ height: height / 3 + 30 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {productsToRelease()}
        </ScrollView>
      </Box>

      <ActionButton
        title='סיום'
        handler={() => {
          clearProducts();
          navigation.goBack()
          navigation.navigate('HomeScreen');
        }}
      />

      <Text className='mt-5 text-center text-sm'>
        במקרה של תהליך שחרור לא מוצלח, יש לפנות לעובד חנות
      </Text>

      <Popup
        visible={modalVisible}
        isError={modalInfo.isError}
        setVisible={setModalVisible}
        onClose={modalInfo.onClose}
        message={modalInfo.message}
      />
    </View>
  );
};

export default ReleaseProductScreen;
