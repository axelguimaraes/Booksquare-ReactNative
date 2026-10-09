import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../Screens/Authentication/WelcomeScreen';
import LoginScreen from '../Screens/Authentication/LoginScreen';
import RegisterScreen from '../Screens/Authentication/RegisterScreen';
import { navigationTheme } from './theme';
import { colors } from '../Components/ui/theme';

export type AuthStackParamsList = {
  WelcomeScreen: undefined
  LoginScreen: undefined
  RegisterScreen: undefined
}

const Stack = createStackNavigator<AuthStackParamsList>();

export default function AuthStack() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        id="AuthStack"
        initialRouteName='WelcomeScreen'
        // Brand background behind the cards, so transitions don't flash white.
        screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.primary } }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
