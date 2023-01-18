import axios from 'axios';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProductsBillList from '../components/ProductsBillList';

// for development
const HOST = 'http://192.168.1.28:5000';

// The Screen should match a quick purchase  (1 product) but also a Flat list of products comes from the Cart
//
const BillScreen = ({ productName, price, navigation }) => {
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

	const makeTransaction = async () => {
		const { customerId } = user.payment;
		try {
			const { data } = await axios.post(`${HOST}/payment/transactions`, {
				customerId,
			});
    
      navigation.navigate('Release') 
			console.log('====================================');
			console.log(data.result);
			console.log('====================================');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<View className='items-center mt-10'>
			<Text className='text-base mb-20 text-3xl'>פרטי תשלום</Text>
			{/* We need to find a way to save the name and the price of the product and use it here, Maybe send it as a prop..
    The Problem is that we get here from button press action and its directly take us to here */}

			<View className='rounded-lg w-3/4 h-2/3 border-2'>
				<View className='flex-row'>
					<Text className='text-base text-xl px-10 py-4 font-bold'>מחיר</Text>
					<Text className='text-base text-xl px-16 py-4 pb-5 font-bold'>
						שם מוצר
					</Text>
				</View>
				<ScrollView>
					<ProductsBillList />
				</ScrollView>
			</View>

			<View className='absolute top-2/3 mt-40 items-center'>
				<View>
					<Text className='text-xl'>סך הכל 100 ש"ח</Text>
				</View>
			</View>
			<TouchableOpacity
				className='items-center content-center w-40 mt-1 mb-1 rounded-2xl border-t-2 border-b-4  '
				onPress={makeTransaction}
			>
				<Text className='text-lg '>תשלום</Text>
			</TouchableOpacity>
			{/* need to sum the prices */}
		</View>
	);
};

export default BillScreen;

// import React, { useState } from "react";
// import { Text, View, ScrollView, TouchableOpacity, Modal } from "react-native";
// import { WebView } from "react-native-webview";
// import ProductsBillList from "../components/ProductsBillList";
// import ActionButton from "../components/ActionButton";

// // The Screen should match a quick purchase  (1 product) but also a Flat list of products comes from the Cart
// //
// const BillScreen = ({ productName, price, navigation }) => {
//   const state = {
//     showModal: false,
//     status: "Pending",
//   };
//   const handleResponse = (data) => {
//     if (data.title === "success") {
//       this.setState({ showModal: false, status: "Complete" });
//     } else if (data.title === "cancel") {
//       this.setState({ showModal: false, status: "Cancelled" });
//     } else {
//       return;
//     }
//   };

//   return (
//     <View className="items-center mt-10">
//       <Text className="text-base mb-20 text-3xl">פרטי תשלום</Text>
//       {/* We need to find a way to save the name and the price of the product and use it here, Maybe send it as a prop..
//     The Problem is that we get here from button press action and its directly take us to here */}

//       <View className="rounded-lg w-3/4 h-2/3 border-2">
//         <View className="flex-row">
//           <Text className="text-base text-xl px-10 py-4 font-bold">מחיר</Text>
//           <Text className="text-base text-xl px-16 py-4 pb-5 font-bold">
//             שם מוצר
//           </Text>
//         </View>
//         <ScrollView>
//           <ProductsBillList />
//         </ScrollView>
//       </View>

//       <View className="absolute top-2/3 mt-40 items-center">
//         <View>
//           <Text>סך הכל 100 ש"ח</Text>
//         </View>
//         <ActionButton
//           title="לחץ לתשלום"
//           screen="Release"
//           navigation={navigation}
//         />

//         <View style={{ marginTop: 100 }}>
//           <Modal
//             visible={state.showModal}
//             onRequestClose={() => ({ showModal: false })}
//           >
//             <WebView
//               source={{ uri: "http://10.0.0.3:3000/" }}
//               onNavigationStateChange={(data) => handleResponse(data)}
//               injectedJavaScript={`document.f1.submit()`}
//             />
//           </Modal>
//           <TouchableOpacity
//             style={{ width: 300, height: 100 }}
//             onPress={() => ({ showModal: true })}
//           >
//             {console.log(state.showModal)}
//             <Text>Pay with Paypal</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* need to sum the prices */}
//     </View>
//   );
// };

// export default BillScreen;
