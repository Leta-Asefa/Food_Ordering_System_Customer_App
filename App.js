import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Navigation from './src/Navigation';
import { AuthUserContextProvider } from './src/context_apis/AuthUserContext';
import { LocationContextProvider } from './src/context_apis/Location';

const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <AuthUserContextProvider>
      <LocationContextProvider>
        <Navigation />
      </LocationContextProvider>
    </AuthUserContextProvider>
  );
};

export default App;
