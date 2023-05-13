import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { watchPurchaseById } from '../api/user';
import useAuth from '../hooks/useAuth';
import useUserStore from '../stores/user';
import { sendReceipt } from '../api/payment';
import usePopup from '../hooks/usePopup';
import Popup from '../components/Popup';
import ActionButton from '../components/ActionButton';

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

  const handleSendReceipt = async () => {
    try {
      setPopUpLoading(true);
      setModalVisible(true);
      await sendReceipt(uuid, transactionId);
      setModalVisible(false);
      setPopUpLoading(false);

      setModalInfo({
        isError: false,
        message: '!הקבלה נשלחה בהצלחה',
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-center font-bold mb-8 ">
          יש להמתין...
        </Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="items-center mt-10 px-7">
      <Text className="mb-10 text-3xl">פרטי רכישה</Text>
      <View className="self-end mb-5">
        <Text className="mb-2 text-xl">
          שם החנות: {foundPurchase?.merchantID}
        </Text>
        <Text className="mb-2 text-xl">
          תאריך: {foundPurchase?.transactionTimeStamp.transactionDate}
        </Text>
        <Text className="mb-2 text-xl">
          שעה: {foundPurchase?.transactionTimeStamp.transactionTime}
        </Text>
        <Text className="mb-2 text-xl">
          סוג כרטיס: {foundPurchase?.cardType}
        </Text>
        <Text className="mb-2 text-xl">
          ספרות אחרונות: {foundPurchase?.last4}
        </Text>
        <Text className="mb-2 text-xl">
          מספר עסקה: {foundPurchase?.transactionId}
        </Text>
      </View>

      <View className="rounded-lg border-2 px-2 mb-4">
        <View className="flex-row-reverse w-full my-4">
          <Text className="text-2xl font-bold w-5/12 text-center">פריט</Text>
          <Text className="text-2xl font-bold w-3/12 text-center">כמות </Text>
          <Text className="text-2xl font-bold w-4/12 text-center">מחיר</Text>
        </View>
        <View className="h-60">
          <FlatList
            data={foundPurchase?.products}
            renderItem={({ item }) => (
              <View className="flex-row-reverse mb-2">
                <Text className="text-xl w-5/12 text-center">
                  {`${item.product.name} ${item.product.size}`}
                </Text>
                <Text className="text-xl w-3/12 text-center">
                  {item.quantity}
                </Text>
                <Text className="text-xl w-4/12 text-center">
                  {item.quantity * item.product.price} ש"ח
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.product.sku}
          />
        </View>
      </View>
      <Text className="text-xl mb-4">
        סך הכל {foundPurchase?.totalAmount} ש"ח
      </Text>
      <ActionButton title="שלח קבלה" handler={handleSendReceipt} />

      <Popup
        visible={modalVisible}
        isError={modalInfo.isError}
        setVisible={setModalVisible}
        onClose={modalInfo.onClose}
        message={modalInfo.message}
        isLoading={popUpLoading}
      />
    </View>
  );
};

export default PurchaseDetailsScreen;
