import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Navigation from './src/Navigation';
import { AuthUserContextProvider } from './src/context_apis/AuthUserContext';

const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <AuthUserContextProvider>
      <Navigation />
    </AuthUserContextProvider>
  );
};

export default App;
