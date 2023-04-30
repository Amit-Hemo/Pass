import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import * as paymentApi from "../api/payment";
import ActionButton from "../components/ActionButton";
import KeyboardDismiss from "../components/KeyboardDismiss";
import useAuth from "../hooks/useAuth";

// for development
const HOST = "http://192.168.1.32:5000";

const ProfileScreen = ({ navigation }) => {
  useAuth();

  const [show, setShow] = useState(false);
  const [user, setUser] = useState({
    userId: "1234",
    firstName: "Albert",
    lastName: "Einstein",
    email: "nadavGeneral@gmail.com",
    payment: {
      customerId: null, //for now, if is empty it will be assigned after the user is added to the vault
      clientToken: null,
    },
  });

  const openPaymentMethodsView = async () => {
    try {
      let customerId = user.payment?.customerId ?? "";
      if (!user.payment?.customerId) {
        customerId = await createCustomer();
      }
      const { data } = await paymentApi.generateClientToken(customerId);
      const { clientToken } = data;

      setUser((prevUser) => ({
        ...prevUser,
        payment: {
          ...prevUser.payment,
          clientToken,
        },
      }));
      setShow(true);
    } catch (error) {
      console.error(error);
    }
  };

  const createCustomer = async () => {
    const { firstName, lastName } = user;
    const { data } = await paymentApi.createCustomer({ firstName, lastName });
    const { customerId } = data;
    setUser((prevUser) => ({
      ...prevUser,
      payment: {
        ...prevUser.payment,
        customerId,
      },
    }));
    return customerId;
  };

  const loadPaymentsScript = `
  	const button = document.querySelector('#submit-button');
    braintree.dropin.create({
		authorization: '${user.payment?.clientToken}',
		container: '#dropin-container',
		paypal: {
			flow: 'vault'
		},
		locale: 'he_IL',
    }, function (createErr, instance) {
      button.addEventListener('click', function () {
        button.textContent="אמצעי תשלום נבחר בהצלחה";
        instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
          // Send payload to React Native to send to the server
          window.ReactNativeWebView.postMessage(payload.nonce);
        });
      });
    });
  `;

  return (
    <KeyboardDismiss>
      <View className="items-center mt-10">
        <Text className="text-base mb-6 text-3xl"> פרופיל משתמש</Text>
        <Text className="text-base mb-2 text-xl font-bold">
          {user.firstName}
        </Text>
        <Text className="text-base mb-2 text-xl font-bold">
          {user.lastName}
        </Text>
        <Text className="text-base mb-6 text-xl font-bold">
          yossi_cohen@gmail.com
        </Text>

        <ActionButton
          title="ערוך פרטים"
          handler={() => {
            navigation.navigate("EditProfile");
          }}
        />

        <Text className="text-base mt-14 mb-6 text-3xl">פרטי אשראי</Text>
        <Text className="text-base mb-2 text-lg"> כרטיס ראשי</Text>
        <Text className="text-base text-xl border-0.5 rounded-lg px-5 h-7 mb-5">
          XXXX-XXXX-XXXX-1111
        </Text>

        <TouchableOpacity
          className="items-center content-center w-40 mt-1 mb-1 rounded-2xl border-t-2 border-b-4  "
          onPress={openPaymentMethodsView}
        >
          <Text className="text-lg ">בחירת אמצעי תשלום</Text>
        </TouchableOpacity>

        <View className="mt-20">
          <ActionButton
            title="היסטורית רכישות"
            handler={() => {
              navigation.navigate("PurchasesHistory");
            }}
          />
        </View>

        <Modal visible={show} onRequestClose={() => setShow(false)}>
          <View className="flex-1">
            <WebView
              source={{ uri: `${HOST}/payment` }}
              onMessage={(event) => {
                setShow(false);
                console.log("nonce", event.nativeEvent.data);
              }}
              startInLoadingState
              renderLoading={() => (
                <View className="flex-1 items-center">
                  <ActivityIndicator size="large" />
                </View>
              )}
              injectedJavaScript={loadPaymentsScript}
              allowsBackForwardNavigationGestures
            />
          </View>
        </Modal>
      </View>
    </KeyboardDismiss>
  );
};

export default ProfileScreen;
