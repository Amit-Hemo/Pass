import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { changePaymentMethod } from '../api/payment';
import { BASE_URL } from '../constants/baseURL';
import useUserStore, {
  setCardLastDigits,
  setHasCreditCard,
} from '../stores/user';
import KeyboardDismiss from './KeyboardDismiss';

const OpenPaymentMethods = ({ clientToken, show, setShow, setIsLoading }) => {
  const HOST = BASE_URL;
  const uuid = useUserStore((state) => state.uuid);

  const loadPaymentsScript = `
      const button = document.querySelector('#submit-button');
      button.style.display = 'none'

      braintree.dropin.create({
      authorization: '${clientToken}',
      container: '#dropin-container',
      paypal: {
        flow: 'vault'
      },
      locale: 'he_IL',
      }, function (createErr, instance) {
        button.style.display = 'block';
        button.addEventListener('click', function () {
          button.textContent="אמצעי תשלום נבחר בהצלחה";
          instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
            // Send payload to React Native to send to the server
            window.ReactNativeWebView.postMessage(JSON.stringify({lastFour: payload.details.lastFour, paymentMethodNonce: payload.nonce}));
          });
        });
      });
    `;

  const handleChangePaymentMethod = async (paymentMethodNonce, lastFour) => {
    try {
      setIsLoading(true);
      setShow(false);
      await changePaymentMethod(uuid, paymentMethodNonce);
      console.log('changed payment method');
      setHasCreditCard(true);
      setCardLastDigits(lastFour);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <KeyboardDismiss>
      <View className='items-center mt-10'>
        <Modal
          visible={show}
          onRequestClose={() => {
            setShow(false);
          }}
        >
          <View className='flex-1 mt-10 '>
            <WebView
              source={{ uri: `${HOST}/payment` }}
              onMessage={(event) => {
                const { lastFour, paymentMethodNonce } = JSON.parse(
                  event.nativeEvent.data
                );
                console.log({ paymentMethodNonce, lastFour });
                handleChangePaymentMethod(paymentMethodNonce, lastFour);
              }}
              injectedJavaScript={loadPaymentsScript}
              allowsBackForwardNavigationGestures
              startInLoadingState
              renderLoading={() => (
                <View className='flex-1 items-center'>
                  <Text className='text-xl text-center font-bold mb-8 '>
                    יש להמתין...
                  </Text>
                  <ActivityIndicator size='large' />
                </View>
              )}
            />
          </View>
        </Modal>
      </View>
    </KeyboardDismiss>
  );
};

export default OpenPaymentMethods;
