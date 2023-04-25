import { AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import HeaderLogo from "./src/components/HeaderLogo";
import BillScreen from "./src/screens/BillScreen";
import CartScreen from "./src/screens/CartScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import OTPScreen from "./src/screens/OTPScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PurchasesHistoryScreen from "./src/screens/PurchasesHistoryScreen";
import ReleaseProductScreen from "./src/screens/ReleaseProductScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import ScanProductScreen from "./src/screens/ScanProductScreen";
import SplashScreen from "./src/screens/SplashScreen";
import UpdatePasswordScreen from "./src/screens/UpdatePasswordScreen";
import React, { useState } from "react";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          title: "ראשי",
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          title: "פרופיל",
          tabBarIcon: () => (
            <AntDesign name="profile" size={24} color="black" />
          ),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackScreen}
        options={{
          headerShown: false,
          title: "עגלה",
          tabBarIcon: () => (
            <AntDesign name="shoppingcart" size={24} color="black" />
          ),
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
}

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#00B8D4",
        },
        title: "",
        cardStyle: {
          backgroundColor: "#fff",
        },
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: "center",
      }}
    >
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />

      <HomeStack.Screen name="ScanProduct" component={ScanProductScreen} />

      <HomeStack.Screen name="Bill" component={BillScreen} />

      <HomeStack.Screen
        name="ReleaseProduct"
        component={ReleaseProductScreen}
      />
    </HomeStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#00B8D4",
        },
        title: "",
        cardStyle: {
          backgroundColor: "#fff",
        },
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: "center",
      }}
    >
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />

      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />

      <ProfileStack.Screen
        name="PurchasesHistory"
        component={PurchasesHistoryScreen}
      />
    </ProfileStack.Navigator>
  );
}

const CartStack = createStackNavigator();
function CartStackScreen() {
  return (
    <CartStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#00B8D4",
        },
        title: "",
        cardStyle: {
          backgroundColor: "#fff",
        },
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: "center",
      }}
    >
      <CartStack.Screen name="CartScreen" component={CartScreen} />

      <CartStack.Screen name="Bill" component={BillScreen} />

      <CartStack.Screen
        name="ReleaseProduct"
        component={ReleaseProductScreen}
      />
    </CartStack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Group>
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
          </Stack.Group>
        ) : (
          <Stack.Group
            screenOptions={{
              headerStyle: {
                backgroundColor: "#00B8D4",
              },
              headerShown: true,
              headerTitle: () => <HeaderLogo />,
              headerTitleAlign: "center",
              cardStyle: {
                backgroundColor: "#fff",
              },
            }}
          >
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerTitle: () => "" }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerLeft: () => {} }}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
            />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
