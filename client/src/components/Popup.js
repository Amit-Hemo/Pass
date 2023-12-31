import React from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';

const Popup = ({
  visible,
  setVisible,
  isError,
  onClose = () => {},
  message,
  isLoading = false,
}) => {
  return (
    <Modal
      isVisible={visible}
      animationIn={'bounceIn'}
      animationOut={'bounceOutDown'}
      className="w-2/3 self-center"
    >
      <View className="bg-white py-16 px-5 rounded-3xl border border-gray-300 shadow-md justify-center items-center">
        {isLoading ? (
          <View>
            <Text className="text-lg text-center font-bold mb-8">
              יש להמתין...
            </Text>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <Image
              source={
                isError
                  ? {
                      uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1682935502/Pass/fail-mark_l8hwwf.png',
                    }
                  : {
                      uri: 'https://res.cloudinary.com/dawvcozos/image/upload/v1682935502/Pass/check-mark_sjr0sr.png',
                    }
              }
              className="w-28 h-28 mb-8"
            />
            <Text className="text-lg text-center font-bold mb-4">
              {message}
            </Text>
            <TouchableOpacity
              className={`border-2 border-blue-500 rounded-full px-4 pt-2 ${
                Platform.OS === 'ios' ? 'pb-1' : 'pb-2'
              } items-center justify-center`}
              onPress={() => {
                onClose();
                setVisible(false);
              }}
            >
              <Text className="text-blue-500 font-bold text-lg">אישור</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

export default Popup;
