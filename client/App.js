import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import HeaderLogo from './src/components/HeaderLogo';
import BillScreen from './src/screens/BillScreen';
import CartScreen from './src/screens/CartScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PurchasesHistoryScreen from './src/screens/PurchasesHistoryScreen';
import ReleaseProductScreen from './src/screens/ReleaseProductScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ScanProductScreen from './src/screens/ScanProductScreen';
import SplashScreen from './src/screens/SplashScreen';
import UpdatePasswordScreen from './src/screens/UpdatePasswordScreen';

const SplashStack = createStackNavigator();
function SplashStackScreen() {
  return (
    <SplashStack.Navigator>
      <SplashStack.Screen
        name='SplashScreen'
        component={SplashScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='LoginScreen'
        component={LoginScreen}
        options={{
          title: '',
          headerShown: false,
          headerLeft: () => null,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='HomeScreen'
        component={HomeScreen}
        options={{
          title: '',
          headerShown: false,
          headerLeft: () => null,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='CreateAccountScreen'
        component={CreateAccountScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='ForgotPasswordScreen'
        component={ForgotPasswordScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </ForgotPasswordStack.Navigator>
  );
}

const OTPStack = createStackNavigator();
function OTPStackScreen() {
  return (
    <OTPStack.Navigator>
      <OTPStack.Screen
        name='OTPScreen'
        component={OTPScreen}
        options={{
          title: '',
          headerShown: false,
          headerLeft: () => null,
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </OTPStack.Navigator>
  );
}
const ResetPasswordStack = createStackNavigator();
function ResetPasswordStackScreen() {
  return (
    <ResetPasswordStack.Navigator>
      <ResetPasswordStack.Screen
        name='ResetPasswordScreen'
        component={ResetPasswordScreen}
        options={{
          title: '',
          headerShown: false,
          headerLeft: () => null,
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </ResetPasswordStack.Navigator>
  );
}

const ScanProductStack = createStackNavigator();
function ScanProductStackScreen() {
  return (
    <ScanProductStack.Navigator>
      <ScanProductStack.Screen
        name='ScanProductScreen'
        component={ScanProductScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='BillScreen'
        component={BillScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='ReleaseScreen'
        component={ReleaseProductScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='ProfileScreen'
        component={ProfileScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </ProfileStack.Navigator>
  );
}

const EditProfileStack = createStackNavigator();
function EditProfileStackScreen() {
  return (
    <EditProfileStack.Navigator>
      <EditProfileStack.Screen
        name='EditProfileScreen'
        component={EditProfileScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </EditProfileStack.Navigator>
  );
}

const UpdatePasswordStack = createStackNavigator();
function UpdatePasswordStackScreen() {
  return (
    <UpdatePasswordStack.Navigator>
      <UpdatePasswordStack.Screen
        name='UpdatePasswordScreen'
        component={UpdatePasswordScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </UpdatePasswordStack.Navigator>
  );
}

const CartStack = createStackNavigator();
function CartStackScreen() {
  return (
    <CartStack.Navigator>
      <CartStack.Screen
        name='CartScreen'
        component={CartScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
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
        name='PurchasesHistoryScreen'
        component={PurchasesHistoryScreen}
        options={{
          title: '',
          headerShown: false,
          cardStyle: {
            backgroundColor: '#fff',
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
        initialRouteName='Splash'
        screenOptions={{
          headerStyle: {
            backgroundColor: '#00B8D4',
          },
          headerTitleAlign: 'center',
          headerTitle: () => <HeaderLogo />,
        }}
      >
        <Tab.Screen
          name='Home'
          component={HomeStackScreen}
          options={{
            title: 'ראשי',
            tabBarIcon: () => (
              <AntDesign
                name='home'
                size={24}
                color='black'
              />
            ),
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='Profile'
          component={ProfileStackScreen}
          options={{
            title: 'פרופיל',
            tabBarIcon: () => (
              <AntDesign
                name='profile'
                size={24}
                color='black'
              />
            ),
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='EditProfile'
          component={EditProfileStackScreen}
          options={{
            title: '',
            headerTitle: () => null,
            tabBarStyle: { display: 'none' },
            tabBarButton: () => null,
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='UpdatePassword'
          component={UpdatePasswordStackScreen}
          options={{
            title: '',
            headerTitle: () => null,
            tabBarStyle: { display: 'none' },
            tabBarButton: () => null,
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='Cart'
          component={CartStackScreen}
          options={{
            title: 'עגלה',
            tabBarIcon: () => (
              <AntDesign
                name='shoppingcart'
                size={24}
                color='black'
              />
            ),
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='Splash'
          component={SplashStackScreen}
          options={{
            title: '',
            headerTitle: () => null,
            tabBarStyle: { display: 'none' },
            tabBarButton: () => null,
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='Login'
          component={LoginStackScreen}
          options={{
            title: '',
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='CreateAccount'
          component={CreateAccountStackScreen}
          options={{ title: '', tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name='ForgotPassword'
          component={ForgotPasswordStackScreen}
          options={{ title: '', tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name='OTP'
          component={OTPStackScreen}
          options={{
            title: '',
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='ResetPassword'
          component={ResetPasswordStackScreen}
          options={{
            title: '',
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
        ></Tab.Screen>

        <Tab.Screen
          name='ScanProduct'
          component={ScanProductStackScreen}
          options={{ title: '', tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name='Bill'
          component={BillStackScreen}
          options={{ title: '', tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name='Release'
          component={ReleaseStackScreen}
          options={{ title: '', tabBarButton: () => null }}
        ></Tab.Screen>

        <Tab.Screen
          name='PurchasesHistory'
          component={PurchasesHistoryStackScreen}
          options={{ title: '', tabBarButton: () => null }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
