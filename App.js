import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { UserProvider } from './src/context_apis/UserContext';
import Navigation from './src/Navigation';

const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <UserProvider>
      <Navigation />
    </UserProvider>
  );
};

export default App;
