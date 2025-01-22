import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";
import Fontisto from 'react-native-vector-icons/Fontisto';
import Signup from './screens/auths/signup';
import Login from './screens/auths/login';
import Restaurants from './screens/lists/HomeScreenRestaurants';
import RestaurantDetails from './screens/lists/RestaurantDetails';
import Cart from './screens/checkout/Cart';
import DeliveryAddress from './screens/checkout/DeliveryAddress';
import Payment from './screens/checkout/Payment';
import OrderTracking from './screens/checkout/OrderTracking';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConfirmOrder from "./screens/checkout/ConfirmOrder";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {





    return (
        <NavigationContainer>

            <Stack.Navigator>
                <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
                <Stack.Screen name='signup' component={Signup} options={{ headerShown: false }} />
                <Stack.Screen name='bottomTabs' component={TabNavigation} options={{ headerShown: false }} />
            </Stack.Navigator>

        </NavigationContainer>

    );
};

export default Navigation;




const TabNavigation = () => {

    return (

        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'grey',
                tabBarActiveBackgroundColor: 'darkgray',
                tabBarInactiveBackgroundColor: '#eeeeee',
                animation: 'shift'
            }}
        >
            <Tab.Screen name='restaurants_list' component={RestaurantsStackNavigator} />
            <Tab.Screen name='order_tracking' component={OrderTracking} />
            <Stack.Screen name='deliveryaddress' component={DeliveryAddress} />
            <Stack.Screen name='confirmorder' component={ConfirmOrder} />

        </Tab.Navigator>

    );
};


const RestaurantsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="restaurants" component={Restaurants} />
            <Stack.Screen name="restaurant_detail" component={RestaurantDetails} />
            <Stack.Screen name='cart' component={Cart} />
            <Stack.Screen name='payment' component={Payment} />
        </Stack.Navigator>
    );
};

