import Modal from 'react-native-modal';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import useProductStore, {
  setClearProduct,
  setScanned,
} from '../stores/product';
import useUserStore from '../stores/user';
import { createFastTransaction } from '../api/payment';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
import { useState } from 'react';
import handleApiError from '../utils/handleApiError';

const PurchasePopup = ({ visible, setVisible, navigation }) => {
  const uuid = useUserStore((state) => state.uuid);
  const tagUuid = useProductStore((state) => state.tagUuid);
  const price = useProductStore((state) => state.price);
  const [isLoading, setIsLoading] = useState(false);
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();

  const handleFastPurchase = async () => {
    try {
      setVisible(false);
      setIsLoading(true);
      setModalVisible(true);
      const { data } = await createFastTransaction(uuid, tagUuid);
      const { result } = data;
      console.log(result);
      setIsLoading(false);
      setModalVisible(false);
      setModalInfo({
        isError: false,
        message: 'המוצר נרכש בהצלחה, תתחדשו !',
        onClose: () => {
          navigation.navigate('ReleaseProduct');

          //TODO: remove this from here after we figure put the nfc release
          setScanned(false);
        },
      });
      setModalVisible(true);
    } catch (error) {
      console.log(error);
      const errorMessage = handleApiError(error);
      setIsLoading(false);
      setModalVisible(false);
      setModalInfo({
        isError: true,
        message: errorMessage,
      });
      setModalVisible(true);
    }
  };

  return (
    <View>
      <Modal
        isVisible={visible}
        animationIn={'bounceIn'}
        animationOut={'bounceOutDown'}
        className="w-2/3 self-center"
      >
        <View className="bg-white py-16 px-5 rounded-3xl border border-gray-300 shadow-md justify-center items-center">
          <>
            <Image
              className="w-28 h-28 mb-8"
              source={{
                uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1683056863/Pass/payment_gnz7bw.png',
              }}
            />
            <Text className="text-xl text-center font-bold mb-4">
              {` סכום סופי לתשלום: ${price} ש"ח`}
            </Text>

            <View className="flex-row p-2 justify-evenly ">
              <TouchableOpacity
                className={` border-2 border-red-700 rounded-full px-6 pt-2 mx-4 ${
                  Platform.OS === 'ios' ? 'pb-1' : 'pb-2'
                } items-center justify-center`}
                onPress={() => {
                  setVisible(false);
                  setClearProduct;
                }}
              >
                <Text className="text-red-600 font-bold text-lg">בטל</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`border-2 border-green-600 rounded-full px-6 pt-2 mx-4 ${
                  Platform.OS === 'ios' ? 'pb-1' : 'pb-2'
                } items-center justify-center`}
                onPress={() => {
                  handleFastPurchase();
                  setVisible(false);
                }}
              >
                <Text className=" text-green-600 font-bold text-lg">שלם</Text>
              </TouchableOpacity>
            </View>
          </>
        </View>
      </Modal>

      <View>
        <Popup
          visible={modalVisible}
          isError={modalInfo.isError}
          setVisible={setModalVisible}
          onClose={modalInfo.onClose}
          message={modalInfo.message}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default PurchasePopup;
