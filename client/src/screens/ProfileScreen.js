import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Text, View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import ActionButton from '../components/ActionButton';
import KeyboardDismiss from '../components/KeyboardDismiss';

// for development
const HOST = 'http://192.168.1.28:5000';

const ProfileScreen = ({ navigation }) => {
	const [show, setShow] = useState(false);
	const [user, setUser] = useState({
		userId: '1234',
		firstName: 'Nadav',
		lastName: 'Buchwalter',
		payment: {
			customerId: '587516900',
			clientToken:
				'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUyTnpRd05qQXhNakFzSW1wMGFTSTZJbVU0TURWak5HRTJMV0UyTjJRdE5ESmtZeTA0WmpCaUxXSTBOREkxTVdWak1URTRNaUlzSW5OMVlpSTZJblk0ZERKemEzQnJOblp0YzNkNGNEWWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pZGpoME1uTnJjR3MyZG0xemQzaHdOaUlzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPblJ5ZFdWOUxDSnlhV2RvZEhNaU9sc2liV0Z1WVdkbFgzWmhkV3gwSWwwc0luTmpiM0JsSWpwYklrSnlZV2x1ZEhKbFpUcFdZWFZzZENKZExDSnZjSFJwYjI1eklqcDdJbU4xYzNSdmJXVnlYMmxrSWpvaU5UZzNOVEUyT1RBd0luMTkuLUdPYllIS1dBU1BPUElGQjZWcVVOYW4zTFNIUWswLTRrVVg0V3d2VnhwZkhWcnIwX0NiRE5HdE5VZS1sa0k0cjR2UVNzNEhfZmp0UGNCbDJfMWx4SFE/Y3VzdG9tZXJfaWQ9IiwiY29uZmlnVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3Y4dDJza3BrNnZtc3d4cDYvY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwiZ3JhcGhRTCI6eyJ1cmwiOiJodHRwczovL3BheW1lbnRzLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJoYXNDdXN0b21lciI6dHJ1ZSwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL3Y4dDJza3BrNnZtc3d4cDYvY2xpZW50X2FwaSIsImVudmlyb25tZW50Ijoic2FuZGJveCIsIm1lcmNoYW50SWQiOiJ2OHQyc2twazZ2bXN3eHA2IiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJ2ZW5tbyI6Im9mZiIsImNoYWxsZW5nZXMiOlsiY3Z2Il0sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL29yaWdpbi1hbmFseXRpY3Mtc2FuZC5zYW5kYm94LmJyYWludHJlZS1hcGkuY29tL3Y4dDJza3BrNnZtc3d4cDYifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOmZhbHNlLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYWxsb3dIdHRwIjp0cnVlLCJkaXNwbGF5TmFtZSI6IlBhc3MiLCJjbGllbnRJZCI6IkFibWJ3T0hfaU5XWEl5eGxid2hEUWZjZUJZc0dMVkxoc19UWW0yRkstcDJmN3VucTFZb3R5TmRNTGY5UmFoTGJ2dEphUkZsYnhtNHd1ZTdiIiwicHJpdmFjeVVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS9wcCIsInVzZXJBZ3JlZW1lbnRVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vdG9zIiwiYmFzZVVybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9jaGVja291dC5wYXlwYWwuY29tIiwiZGlyZWN0QmFzZVVybCI6bnVsbCwiZW52aXJvbm1lbnQiOiJvZmZsaW5lIiwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwibWVyY2hhbnRBY2NvdW50SWQiOiJwYXNzIiwiY3VycmVuY3lJc29Db2RlIjoiVVNEIn19',
		},
	});

	const openPaymentMethodsView = async () => {
		try {
			if (!user.payment?.customerId) {
				await createCustomer();
			}
			setShow(true);
		} catch (error) {
			console.error(error);
		}
	};

	const createCustomer = async () => {
		const { firstName, lastName } = user;
		try {
			const { data } = await axios.post(`${HOST}/payment/customers`, {
				firstName,
				lastName,
			});
			const { customerId, clientToken } = data;
			setUser((prevUser) => ({
				...prevUser,
				payment: {
					customerId,
					clientToken,
				},
			}));
		} catch (error) {
			console.error(error);
		}
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
			<View className='items-center mt-10'>
				<Text className='text-base mb-6 text-3xl'> פרופיל משתמש</Text>
				<Text className='text-base mb-2 text-xl font-bold'> יוסי כהן</Text>
				<Text className='text-base mb-6 text-xl font-bold'>
					{' '}
					yossi_cohen@gmail.com{' '}
				</Text>

				<ActionButton
					title='ערוך פרטים'
					screen='ProfileScreen'
					navigation={navigation}
				/>

				<Text className='text-base mt-14 mb-6 text-3xl'>פרטי אשראי</Text>
				<Text className='text-base mb-2 text-lg'> כרטיס ראשי</Text>
				<Text className='text-base text-xl border-0.5 rounded-lg px-5 h-7 mb-5'>
					XXXX-XXXX-XXXX-6789
				</Text>

				<TouchableOpacity
					className='items-center content-center w-40 mt-1 mb-1 rounded-2xl border-t-2 border-b-4  '
					onPress={openPaymentMethodsView}
				>
					<Text className='text-lg '>בחירת אמצעי תשלום</Text>
				</TouchableOpacity>

				<View className='mt-20'>
					<ActionButton
						title='היסטורית רכישות'
						screen='PurchasesHistory'
						navigation={navigation}
					/>
				</View>

				<Modal
					visible={show}
					onRequestClose={() => setShow(false)}
				>
					<View className='flex-1'>
						<WebView
							source={{ uri: `${HOST}/payment` }}
							onMessage={(event) => {
								setShow(false);
								console.log('nonce', event.nativeEvent.data);
							}}
							startInLoadingState
							renderLoading={() => (
								<View className='flex-1 items-center'>
									<ActivityIndicator size='large' />
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
