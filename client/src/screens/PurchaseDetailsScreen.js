import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { sendReceipt } from '../api/payment';
import { watchPurchaseById } from '../api/user';
import Box from '../components/Box';
import HorizonalLine from '../components/HorizonalLine';
import Popup from '../components/Popup';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import useUserStore from '../stores/user';

const PurchaseDetailsScreen = ({ route }) => {
  useAuth();
  const uuid = useUserStore((state) => state.uuid);
  const transactionId = route?.params?.id;
  const { data: foundPurchase, isLoading } = useQuery(
    ['purchaseDetails', uuid, transactionId],
    () => watchPurchaseById(uuid, transactionId),
    { select: (data) => data.foundPurchase, enabled: true }
  );
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const [popUpLoading, setPopUpLoading] = useState(false);

  const cardTypeToImageUrl = {
    visa: { uri: require('../../assets/visa.png'), width: 40, height: 30 },
    mastercard: {
      uri: require('../../assets/mastercard.png'),
      width: 35,
      height: 30,
    },
  };

  const handleSendReceipt = async () => {
    try {
      setPopUpLoading(true);
      setModalVisible(true);
      await sendReceipt(uuid, transactionId);
      setModalVisible(false);
      setPopUpLoading(false);

      setModalInfo({
        isError: false,
        message: 'הקבלה נשלחה בהצלחה!',
      });
      setModalVisible(true);
    } catch (error) {
      setPopUpLoading(false);
      setModalVisible(false);
      setModalInfo({
        isError: true,
        message: 'שגיאה בשליחת הקבלה',
      });
      setModalVisible(true);
    }
  };

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-xl text-center font-bold mb-8 '>
          יש להמתין...
        </Text>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <ScrollView>
      <View className='items-center mt-10 px-7'>
        <Box>
          <Text className='font-bold text-xl mb-3'>
            {foundPurchase?.merchantID}
          </Text>
          <Text className='font-extrabold text-2xl text-blue-600'>
            {foundPurchase?.totalAmount} ש"ח
          </Text>
        </Box>

        <Box>
          <Text className='font-semibold text-[19px] mb-3 self-start'>
            פרטי תשלום
          </Text>
          <View className='flex-row justify-between w-full'>
            <Text className='text-gray-400 font-semibold text-base'>תאריך</Text>
            <Text className='font-semibold text-base'>
              {foundPurchase?.transactionTimeStamp.transactionDate} -{' '}
              {foundPurchase?.transactionTimeStamp.transactionTime}
            </Text>
          </View>
          <HorizonalLine />
          <View className='flex-row justify-between w-full'>
            <Text className='text-gray-400 font-semibold text-base'>
              מספר עסקה
            </Text>
            <Text className='font-semibold text-base'>
              {foundPurchase?.transactionId}
            </Text>
          </View>
          <HorizonalLine />

          <View className='flex-row justify-between items-center w-full space-x-3'>
            <View className='flex-row items-center space-x-3 justify-between'>
              <Image
                source={
                  cardTypeToImageUrl[foundPurchase?.cardType.toLowerCase()]?.uri
                }
                style={{
                  width:
                    cardTypeToImageUrl[foundPurchase?.cardType.toLowerCase()]
                      ?.width,
                  height:
                    cardTypeToImageUrl[foundPurchase?.cardType.toLowerCase()]
                      ?.height,
                  marginTop: 2,
                }}
              />

              <Text className='font-semibold text-base'>
                {foundPurchase?.cardType}
              </Text>
            </View>
            <Text className='font-semibold text-base'>
              xxxx-{foundPurchase?.last4}
            </Text>
          </View>
          <HorizonalLine />
          <View className='w-full mt-3'>
            <TouchableOpacity
              className='bg-yellow-400 py-2 px-6 items-center justify-center shadow-black'
              onPress={handleSendReceipt}
              style={{ borderRadius: 10, elevation: 5 }}
            >
              <Text className='text-lg font-semibold text-white'>שלח קבלה</Text>
            </TouchableOpacity>
          </View>
        </Box>

        <Box>
          <Text className='font-semibold text-[18px] mb-3 self-start'>
            מוצרים שנרכשו
          </Text>
          {foundPurchase?.products.map(({ product, quantity }) => (
            <View key={product.sku} className='w-full'>
              <View className='flex-row justify-between items-center'>
                <View className='items-start'>
                  <Text className='text-base font-medium'>
                    {product.name} - {product.size}
                  </Text>
                  <Text className='text-sm text-gray-500 font-semibold'>כמות: {quantity}</Text>
                </View>
                <Text className='font-bold'>{quantity * product.price} ש"ח</Text>
              </View>
              <HorizonalLine />
            </View>
          ))}
        </Box>

        <Popup
          visible={modalVisible}
          isError={modalInfo.isError}
          setVisible={setModalVisible}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
          isLoading={popUpLoading}
        />
      </View>
    </ScrollView>
  );
};

{
  /* <Text className='mb-2 text-xl'>
          שם החנות: {foundPurchase?.merchantID}
        </Text>
        <Text className='mb-2 text-xl'>
          תאריך: {foundPurchase?.transactionTimeStamp.transactionDate}
        </Text>
        <Text className='mb-2 text-xl'>
          שעה: {foundPurchase?.transactionTimeStamp.transactionTime}
        </Text>
        <Text className='mb-2 text-xl'>
          סוג כרטיס: {foundPurchase?.cardType}
        </Text>
        <Text className='mb-2 text-xl'>
          ספרות אחרונות: {foundPurchase?.last4}
        </Text>
        <Text className='mb-2 text-xl'>
          מספר עסקה: {foundPurchase?.transactionId}
        </Text>
      </View>
      <View className='rounded-lg border-2 px-2 mb-4'>
        <View className='flex-row w-full my-4'>
          <Text className='text-2xl font-bold w-5/12 text-center'>פריט</Text>
          <Text className='text-2xl font-bold w-3/12 text-center'>כמות </Text>
          <Text className='text-2xl font-bold w-4/12 text-center'>מחיר</Text>
        </View>
        <View className='h-52'>
          <FlatList
            data={foundPurchase?.products}
            renderItem={({ item }) => (
              <View className='flex-row mb-2'>
                <Text className='text-xl w-5/12 text-center'>
                  {`${item.product.name} ${item.product.size}`}
                </Text>
                <Text className='text-xl w-3/12 text-center'>
                  {item.quantity}
                </Text>
                <Text className='text-xl w-4/12 text-center'>
                  {item.quantity * item.product.price} ש"ח
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.product.sku}
          />
        </View>
      </View>
      <Text className='text-xl mb-4'>
        סך הכל {foundPurchase?.totalAmount} ש"ח
      </Text> */
}

export default PurchaseDetailsScreen;
