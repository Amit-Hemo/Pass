import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { changePaymentMethod } from '../api/payment';
import { BASE_URL } from '../constants/baseURL';
import useUserStore, {
  setCardLastDigits,
  setCardType,
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
            window.ReactNativeWebView.postMessage(JSON.stringify({lastFour: payload.details.lastFour, cardType: payload.details.cardType ,paymentMethodNonce: payload.nonce}));
          });
        });
      });
    `;

  const handleChangePaymentMethod = async (
    paymentMethodNonce,
    lastFour,
    cardType
  ) => {
    try {
      setIsLoading(true);
      setShow(false);
      await changePaymentMethod(uuid, paymentMethodNonce);
      setHasCreditCard(true);
      setCardLastDigits(lastFour);
      setCardType(cardType);
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
                const { lastFour, cardType, paymentMethodNonce } = JSON.parse(
                  event.nativeEvent.data
                );
                handleChangePaymentMethod(
                  paymentMethodNonce,
                  lastFour,
                  cardType
                );
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
