import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { URL } from "react-native-url-polyfill";
import { WebView } from "react-native-webview";
import ProductsBillList from "../components/ProductsBillList";
import ActionButton from "../components/ActionButton";

// The Screen should match a quick purchase  (1 product) but also a Flat list of products comes from the Cart
//
const BillScreen = ({ productName, price, navigation }) => {
  const [showModal, setShowModal] = useState(false);
  // const [status, setStatus] = useState("Pending");

  const handleResponse = (data) => {
    const url = new URL(data.url);
    const costumerToken = url.searchParams.get("token");
    // console.log(costumerToken);
    // console.log(url.searchParams.get("PayerID"));

    // console.log(data.url);
    console.log(data);

    if (data.title === "success") {
      setShowModal(false);
      // setStatus("Complete");
      navigation.navigate("Release");
    } else if (data.title === "cancel") {
      setShowModal(false);
      // setStatus("Cancelled");
      navigation.navigate("Bill");
    } else {
      return;
    }
  };

  return (
    <View className="items-center mt-10">
      <Text className="text-base mb-20 text-3xl">פרטי תשלום</Text>
      {/* We need to find a way to save the name and the price of the product and use it here, Maybe send it as a prop..
    The Problem is that we get here from button press action and its directly take us to here */}

      <View className="rounded-lg w-3/4 h-2/3 border-2">
        <View className="flex-row">
          <Text className="text-base text-xl px-10 py-4 font-bold">מחיר</Text>
          <Text className="text-base text-xl px-16 py-4 pb-5 font-bold">
            שם מוצר
          </Text>
        </View>
        <ScrollView>
          <ProductsBillList />
        </ScrollView>
      </View>

      <View className="absolute top-2/3 mt-40 items-center">
        <View>
          <Text className="text-xl">סך הכל 100 ש"ח</Text>
        </View>

        <View>
          <Modal
            visible={showModal}
            onRequestClose={() => {
              setShowModal(false);
            }}
          >
            <WebView
              source={{ uri: "http://10.0.0.4:3000/paypal" }}
              onNavigationStateChange={(data) => handleResponse(data)}
            />
          </Modal>
          <TouchableOpacity
            className="items-center w-60 h-10 mb-1 mt-5 rounded-2xl border-t-2 border-b-4 "
            onPress={() => {
              setShowModal(true);
            }}
          >
            <Text className="items-center text-2xl">שלם באמצעות Paypal</Text>
          </TouchableOpacity>
        </View>
      </View>

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
