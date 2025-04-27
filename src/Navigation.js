import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Text, View} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Signup from './screens/auths/signup';
import Login from './screens/auths/login';
import Restaurants from './screens/lists/HomeScreenRestaurants';
import RestaurantDetails from './screens/lists/RestaurantDetails';
import Cart from './screens/checkout/Cart';
import DeliveryAddress from './screens/checkout/DeliveryAddress';
import Payment from './screens/checkout/Payment';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConfirmOrder from './screens/checkout/ConfirmOrder';
import OrderHistory from './screens/order_history/OrderHistory';
import OrderTracking from './screens/order_history/OrderTracking';
import UserSettings from './screens/settings/UserSettings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserInfo from './screens/partials/UserInfo';
import {RestaurantsListProvider} from './context_apis/RestaurantsList';
import ForgotPassword from './screens/auths/forgotPassword';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
      >
        <Stack.Screen
          name="login"
          component={Login}
        />
        <Stack.Screen
          name="signup"
          component={Signup}
        />
        <Stack.Screen
          name="forgot_password"
          component={ForgotPassword}
        />
        <Stack.Screen name="payment" component={Payment} />
        <Stack.Screen
          name="bottomTabs"
          component={TabNavigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        header: () => <UserInfo />, // Custom header
        headerShown: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
        tabBarActiveBackgroundColor: 'darkgray',
        tabBarInactiveBackgroundColor: '#eeeeee',
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          // Set icons based on route name
          if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'restaurants_list') {
            iconName = focused ? 'restaurant' : 'restaurant-sharp';
          } else if (route.name === 'order_history_stack') {
            iconName = focused ? 'list' : 'list-outline';
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="restaurants_list"
        component={RestaurantsStackNavigator}
      />
      <Tab.Screen name="order_history_stack" component={OrderHistoryStack} />
      <Tab.Screen name="settings" component={UserSettings} />
      <Tab.Screen name="address" component={DeliveryAddress} />
    </Tab.Navigator>
  );
};

const RestaurantsStackNavigator = () => {
  return (
    <RestaurantsListProvider>
      <Stack.Navigator screenOptions={{headerShown: false,}}>
        <Stack.Screen name="restaurants" component={Restaurants} />
        <Stack.Screen name="restaurant_detail" component={RestaurantDetails} />
        <Stack.Screen name="cart" component={Cart} />
        <Stack.Screen name="deliveryaddress" component={DeliveryAddress} />
        <Stack.Screen name="confirmorder" component={ConfirmOrder} />
      </Stack.Navigator>
    </RestaurantsListProvider>
  );
};

const OrderHistoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="order_history" component={OrderHistory} />
      <Stack.Screen name="order_tracking" component={OrderTracking} />
    </Stack.Navigator>
  );
};
