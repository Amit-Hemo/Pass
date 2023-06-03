import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  TransitionSpecs,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  useQuery,
} from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, I18nManager, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { getUser, watchCart } from './src/api/user';
import HeaderLogo from './src/components/HeaderLogo';
import Popup from './src/components/Popup';
import useHandleAuth from './src/hooks/useHandleAuth';
import usePopup from './src/hooks/usePopup';
import useRefreshOnFocus from './src/hooks/useRefreshOnFocus';
import CartScreen from './src/screens/CartScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PurchaseDetailsScreen from './src/screens/PurchaseDetailsScreen';
import PurchasesHistoryScreen from './src/screens/PurchasesHistoryScreen';
import ReleaseProductScreen from './src/screens/ReleaseProductScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ScanProductScreen from './src/screens/ScanProductScreen';
import SplashScreen from './src/screens/SplashScreen';
import UpdatePasswordScreen from './src/screens/UpdatePasswordScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import useAuthStore, {
  setAccessToken,
  setClearAuth,
  setIsForcedLogout,
  setIsLoggedIn,
  setIsSignedWithProvider,
} from './src/stores/auth';
import useUserStore, {
  clearUser,
  setEmail,
  setFirstName,
  setLastName,
  setUuid,
} from './src/stores/user';
import checkAuthStatus from './src/utils/checkAuthStatus';
import countCartAmount from './src/utils/countCartAmount';
import filterUnavailableTags from './src/utils/filterUnavailableTags';

//Force right to left - Hebrew App
I18nManager.forceRTL(true);
//For oAuth browsers
WebBrowser.maybeCompleteAuthSession();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const queryClient = new QueryClient();

function HomeTabs() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const uuid = useUserStore((state) => state.uuid);
  const handleAuth = useHandleAuth();
  const isForced = useAuthStore((state) => state.isForcedLogout);
  const { modalVisible, setModalVisible, modalInfo, setModalInfo } = usePopup();
  const { data: cart } = useQuery(['cart', uuid], () => watchCart(uuid), {
    select: (data) => {
      const filteredCart = filterUnavailableTags([...data.cart]);
      return filteredCart.reverse();
    },
  });
  useRefreshOnFocus(() => queryClient.invalidateQueries(['cart', uuid]));

  let cartAmount = 0;
  if (cart) {
    cartAmount = countCartAmount(cart);
  }

  useEffect(() => {
    if (isForced) {
      setModalInfo({
        isError: true,
        message: 'קרתה שגיאה בלתי צפויה, יש לנסות להתחבר מחדש במועד מאוחר יותר',
        onClose: () => {
          setClearAuth();
          clearUser();
          setIsForcedLogout(false);
        },
      });
      setModalVisible(true);
    }
  }, [isForced]);

  useEffect(() => {
    let lastAppState = appState.current;
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (lastAppState !== nextAppState) {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          handleAuth();
        }
        lastAppState = nextAppState;
      }
      focusManager.setFocused(nextAppState === 'active');
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View className='flex-1'>
      <Popup
        visible={modalVisible}
        setVisible={setModalVisible}
        isError={modalInfo.isError}
        onClose={modalInfo.onClose}
        message={modalInfo.message}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarItemStyle: { marginBottom: 2 },
          tabBarLabelStyle: { fontWeight: '600', fontSize: 11 },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name='Home'
          component={HomeStackScreen}
          options={{
            headerShown: false,
            title: 'ראשי',
            tabBarIcon: ({ focused, color }) => (
              <AntDesign
                name='home'
                size={24}
                color={`${focused ? color : 'black'}`}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Profile'
          component={ProfileStackScreen}
          options={{
            headerShown: false,
            title: 'פרופיל',
            tabBarIcon: ({ focused, color }) => (
              <AntDesign
                name='profile'
                size={24}
                color={`${focused ? color : 'black'}`}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Cart'
          component={CartStackScreen}
          options={{
            headerShown: false,
            title: 'עגלה',
            tabBarIcon: ({ focused, color }) => (
              <AntDesign
                name='shoppingcart'
                size={24}
                color={`${focused ? color : 'black'}`}
              />
            ),
            tabBarBadge: cartAmount,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3BABFE',
        },
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
      }}
    >
      <HomeStack.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{
          headerTitle: () => <HeaderLogo />,
        }}
      />

      <HomeStack.Screen
        name='ScanProduct'
        component={ScanProductScreen}
        options={{
          title: 'סריקת מוצר',
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          gestureResponseDistance: 1000,
        }}
      />

      <HomeStack.Screen
        name='ReleaseProduct'
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
          backgroundColor: '#3BABFE',
        },
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        gestureResponseDistance: 60,
      }}
    >
      <ProfileStack.Screen
        name='ProfileScreen'
        component={ProfileScreen}
        options={{
          title: 'פרופיל משתמש',
        }}
      />

      <ProfileStack.Screen
        name='EditProfile'
        component={EditProfileScreen}
        options={{
          title: 'עריכת פרופיל',
        }}
      />

      <ProfileStack.Screen
        name='UpdatePassword'
        component={UpdatePasswordScreen}
        options={{
          title: 'יצירת סיסמא חדשה',
        }}
      />

      <ProfileStack.Screen
        name='PurchasesHistory'
        component={PurchasesHistoryScreen}
        options={{
          title: 'היסטורית רכישות',
        }}
      />

      <ProfileStack.Screen
        name='PurchaseDetails'
        component={PurchaseDetailsScreen}
        options={{
          title: 'פרטי רכישה',
        }}
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
          backgroundColor: '#3BABFE',
        },
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
      }}
    >
      <CartStack.Screen
        name='CartScreen'
        component={CartScreen}
        options={{
          title: 'עגלת קניות',
        }}
      />

      <CartStack.Screen
        name='ReleaseProduct'
        component={ReleaseProductScreen}
      />
    </CartStack.Navigator>
  );
}

export default function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    async function restoreToken() {
      console.log('====================================');
      console.log('checking');
      console.log('====================================');
      try {
        const accessToken = await checkAuthStatus();
        if (accessToken) {
          setAccessToken(accessToken);
          const { uuid } = await jwtDecode(accessToken);
          const { data } = await getUser(uuid);
          const { firstName, lastName, email } = data.user;
          setUuid(uuid);
          setFirstName(firstName);
          setLastName(lastName);
          setEmail(email);
          setIsLoggedIn(true);

          const isSignedWithProvider = await SecureStore.getItemAsync(
            'signedWithProvider'
          );
          console.log({isSignedWithProvider});
          if (isSignedWithProvider) {
            setIsSignedWithProvider(true);
          }
        } else {
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          await SecureStore.deleteItemAsync('signedWithProvider');
        }
      } catch (error) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('signedWithProvider');
        console.log(error?.response?.data?.error);
      }
    }
    restoreToken();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar
        style='dark'
        backgroundColor='white'
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {isLoggedIn ? (
            <Stack.Group>
              <Stack.Screen
                name='HomeTabs'
                component={HomeTabs}
              />
            </Stack.Group>
          ) : (
            <Stack.Group
              screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: '#3BABFE' },
                headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
                headerTitleAlign: 'center',
                headerTintColor: 'white',
                headerShadowVisible: false,
                cardStyle: {
                  backgroundColor: '#fff',
                },
                animationEnabled: false,
              }}
            >
              <Stack.Screen
                name='Splash'
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Welcome'
                component={WelcomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='Login'
                component={LoginScreen}
                options={{
                  title: 'התחברות',
                }}
              />
              <Stack.Screen
                name='CreateAccount'
                component={CreateAccountScreen}
                options={{ title: 'יצירת משתמש' }}
              />
              <Stack.Screen
                name='OTP'
                component={OTPScreen}
                options={{ title: 'אימות' }}
              />
              <Stack.Screen
                name='ForgotPassword'
                component={ForgotPasswordScreen}
                options={{ title: 'שחזור סיסמא' }}
              />
              <Stack.Screen
                name='ResetPassword'
                component={ResetPasswordScreen}
                options={{ title: 'יצירת סיסמא חדשה' }}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
