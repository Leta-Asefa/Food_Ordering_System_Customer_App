import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Navigation from './src/Navigation';
import { AuthUserContextProvider } from './src/context_apis/AuthUserContext';
import { LocationContextProvider } from './src/context_apis/Location';
import { CartContext, CartProvider } from './src/context_apis/CartContext';
import { SocketContextProvider } from './src/context_apis/SocketContext'


const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <AuthUserContextProvider>
    <SocketContextProvider>
        <LocationContextProvider>
          <CartProvider>
            <Navigation />
          </CartProvider>
        </LocationContextProvider>
    </SocketContextProvider>
      </AuthUserContextProvider>
  );
};

export default App;
