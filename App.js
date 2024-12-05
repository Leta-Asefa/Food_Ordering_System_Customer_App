import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Signup from './src/screens/auths/signup';
import Login from './src/screens/auths/login';
import Restaurants from './src/screens/lists/HomeScreenRestaurants';
import RestaurantDetails from './src/screens/lists/RestaurantDetails';
import Cart from './src/screens/checkout/Cart';
import DeliveryAddress from './src/screens/checkout/DeliveryAddress';
import Payment from './src/screens/checkout/Payment';

const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
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


        <Tab.Screen
          name='restaurants_list'
          component={Restaurants}

        />

        <Tab.Screen
          name='cart'
          component={Cart}

        />

<Tab.Screen
          name='payment'
          component={Payment}

        />

        <Tab.Screen
          name='deliveryaddress'
          component={DeliveryAddress}

        />

        <Tab.Screen
          name='restaurant_detail'
          component={RestaurantDetails}

        />


        <Tab.Screen
          name='login'
          component={Login}

        />
        <Tab.Screen
          name='signup'
          component={Signup}

        />








      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
