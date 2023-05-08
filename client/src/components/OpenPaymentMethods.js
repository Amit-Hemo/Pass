import { ActivityIndicator, Modal, View } from 'react-native';
import { WebView } from 'react-native-webview';
import KeyboardDismiss from './KeyboardDismiss';
import { setCardLastDigits, setHasCreditCard } from '../stores/user';
import { BASE_URL } from '../constants/baseURL';

const OpenPaymentMethods = ({ clientToken, show, setShow }) => {
  // for development

  const HOST = BASE_URL;

  const loadPaymentsScript = `
      const button = document.querySelector('#submit-button');
      braintree.dropin.create({
      authorization: '${clientToken}',
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
            window.ReactNativeWebView.postMessage(payload.details.lastFour);
          });
        });
      });
    `;

  return (
    <KeyboardDismiss>
      <View className="items-center mt-10">
        <Modal
          visible={show}
          onRequestClose={() => {
            setShow(false);
          }}
        >
          <View className="flex-1 mt-10">
            <WebView
              source={{ uri: `${HOST}/payment` }}
              onMessage={(event) => {
                setShow(false);
                setHasCreditCard(true);
                setCardLastDigits(event.nativeEvent.data);
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

export default OpenPaymentMethods;
