import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionButton from '../components/ActionButton';
import KeyboardDismiss from '../components/KeyboardDismiss';
import useAuth from '../hooks/useAuth';
import useUserStore from '../stores/user';
import OpenPaymentMethods from '../components/OpenPaymentMethods';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
import { generateClientToken } from '../api/payment';
import { useState } from 'react';

const ProfileScreen = ({ navigation }) => {
  useAuth();

  const [clientToken, setClientToken] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const uuid = useUserStore((state) => state.uuid);
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const email = useUserStore((state) => state.email);

  const isCustomer = useUserStore((state) => state.isCustomer);
  const hasCreditCard = useUserStore((state) => state.hasCreditCard);
  const lastDigits = useUserStore((state) => state.cardLastDigits);

  const handleAddPaymentButton = async () => {
    setIsLoading(true);
    try {
      const { data } = await generateClientToken(uuid);
      const { clientToken } = data;
      setClientToken(clientToken);
      setShow(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setModalInfo({
        isError: true,
        message: 'שגיאה בשירות התשלום, יש לנסות מאוחר יותר',
      });
      setModalVisible(true);
      console.log(error);
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
    <KeyboardDismiss>
      <ScrollView>
        <View className="items-center mt-10 px-7">
          <Text className="mb-6 text-3xl">פרופיל משתמש</Text>
          <Text className="mb-2 text-xl font-bold">{firstName}</Text>
          <Text className="mb-2 text-xl font-bold">{lastName}</Text>
          <Text className="mb-6 text-xl font-bold">{email}</Text>
          <ActionButton
            title="ערוך פרטים"
            handler={() => {
              navigation.navigate('EditProfile');
            }}
          />
          <Text className=" mt-10 mb-6 text-2xl">פרטי אשראי</Text>
          {isCustomer && hasCreditCard ? (
            <View className="items-center ">
              <Text className=" mb-2 text-lg font-semibold"> כרטיס ראשי</Text>
              <Text className="text-xl bg-gray-100 rounded-lg px-5 py-2 mb-5">
                {`XXXX-XXXX-XXXX-${lastDigits}`}
              </Text>
              <TouchableOpacity
                className="py-3 px-6 mb-6 bg-blue-400 rounded-lg items-center justify-center shadow-black"
                style={{ elevation: 5 }}
                onPress={() => {
                  handleAddPaymentButton();
                }}
              >
                <Text className="text-white font-semibold">
                  בחירת אמצעי תשלום
                </Text>
              </TouchableOpacity>
              <OpenPaymentMethods
                clientToken={clientToken}
                show={show}
                setShow={setShow}
              />
              <Popup
                visible={modalVisible}
                isError={modalInfo.isError}
                setVisible={setModalVisible}
                onClose={modalInfo.onClose}
                message={modalInfo.message}
              />
              <View className="mt-4">
                <ActionButton
                  title="היסטורית רכישות"
                  handler={() => {
                    navigation.navigate('PurchasesHistory');
                  }}
                />
              </View>
            </View>
          ) : (
            <View className="items-center border-2 rounded-xl mx-2">
              <Text className="text-xl text-center font-bold mb-2 text-red-500 p-10">
                {' '}
                קיימות אופציות נוספות בעמוד זה לאחר הוספת אמצעי תשלום ראשוני בעמוד
                הראשי{' '}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardDismiss>
  );
};

export default ProfileScreen;
