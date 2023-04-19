import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ScanProductScreen from "./src/screens/ScanProductScreen";
import BillScreen from "./src/screens/BillScreen";
import ReleaseProductScreen from "./src/screens/ReleaseProductScreen";
import SplashScreen from "./src/screens/SplashScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CartScreen from "./src/screens/CartScreen";
import PurchasesHistoryScreen from "./src/screens/PurchasesHistoryScreen";
import HeaderLogo from "./src/components/HeaderLogo";
import { AntDesign } from "@expo/vector-icons";

const SplashStack = createStackNavigator();
function SplashStackScreen() {
  return (
    <SplashStack.Navigator>
      <SplashStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </SplashStack.Navigator>
  );
}

const LoginStack = createStackNavigator();
function LoginStackScreen() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: "",
          headerShown: false,
          headerLeft: () => null,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </LoginStack.Navigator>
  );
}

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "",
          headerShown: false,
          headerLeft: () => null,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </HomeStack.Navigator>
  );
}

const CreateAccountStack = createStackNavigator();
function CreateAccountStackScreen() {
  return (
    <CreateAccountStack.Navigator>
      <CreateAccountStack.Screen
        name="CreateAccountScreen"
        component={CreateAccountScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </CreateAccountStack.Navigator>
  );
}

const ForgotPasswordStack = createStackNavigator();
function ForgotPasswordStackScreen() {
  return (
    <ForgotPasswordStack.Navigator>
      <ForgotPasswordStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </ForgotPasswordStack.Navigator>
  );
}

const ScanProductStack = createStackNavigator();
function ScanProductStackScreen() {
  return (
    <ScanProductStack.Navigator>
      <ScanProductStack.Screen
        name="ScanProductScreen"
        component={ScanProductScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </ScanProductStack.Navigator>
  );
}

const BillStack = createStackNavigator();
function BillStackScreen() {
  return (
    <BillStack.Navigator>
      <BillStack.Screen
        name="BillScreen"
        component={BillScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </BillStack.Navigator>
  );
}

const ReleaseStack = createStackNavigator();
function ReleaseStackScreen() {
  return (
    <ReleaseStack.Navigator>
      <ReleaseStack.Screen
        name="ReleaseScreen"
        component={ReleaseProductScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </ReleaseStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </ProfileStack.Navigator>
  );
}

const CartStack = createStackNavigator();
function CartStackScreen() {
  return (
    <CartStack.Navigator>
      <CartStack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </CartStack.Navigator>
  );
}

const PurchasesHistoryStack = createStackNavigator();
function PurchasesHistoryStackScreen() {
  return (
    <PurchasesHistoryStack.Navigator>
      <PurchasesHistoryStack.Screen
        name="PurchasesHistoryScreen"
        component={PurchasesHistoryScreen}
        options={{
          title: "",
          headerShown: false,
          cardStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </PurchasesHistoryStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#00B8D4",
          },
          headerTitleAlign: "center",
          headerTitle: () => <HeaderLogo />,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            title: "ראשי",
            tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
          }}
        ></Tab.Screen>

        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            title: "פרופיל",
            tabBarIcon: () => (
              <AntDesign name="profile" size={24} color="black" />
            ),
          }}
        ></Tab.Screen>

        <Tab.Screen
          name="Cart"
          component={CartStackScreen}
          options={{
            title: "עגלה",
            tabBarIcon: () => (
              <AntDesign name="shoppingcart" size={24} color="black" />
            ),
          }}
        ></Tab.Screen>

        <Tab.Screen
          name="Splash"
          component={SplashStackScreen}
          options={{
            title: "",
            headerTitle: () => null,
            tabBarStyle: { display: "none" },
            tabBarButton: () => null,
          }}
        ></Tab.Screen>

        <Tab.Screen
          name="Login"
          component={LoginStackScreen}
          options={{
            title: "",
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}
        ></Tab.Screen>

        <Tab.Screen
          name="CreateAccount"
          component={CreateAccountStackScreen}
          options={{ title: "", tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name="ForgotPassword"
          component={ForgotPasswordStackScreen}
          options={{ title: "", tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name="ScanProduct"
          component={ScanProductStackScreen}
          options={{ title: "", tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name="Bill"
          component={BillStackScreen}
          options={{ title: "", tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name="Release"
          component={ReleaseStackScreen}
          options={{ title: "", tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name="PurchasesHistory"
          component={PurchasesHistoryStackScreen}
          options={{ title: "", tabBarButton: () => null }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
