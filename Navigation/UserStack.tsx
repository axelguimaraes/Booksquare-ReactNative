import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../Screens/Home/Home';
import Notifications from '../Screens/Notifications/Notifications';
import Search from '../Screens/Search/Search';
import Messages from '../Screens/Messages/Messages';
import UserProfileScreen from '../Screens/Profile/Profile';
import AddBook from '../Screens/AddBook/AddBook';
import ShoppingCartScreen from '../Screens/Shopping/ShoppingCartScreen';
import ChatScreen from '../Screens/Messages/ChatScreen';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={UserProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Sell" component={AddBook} options={{ headerShown: false }} />
        <Stack.Screen name="ShoppingCartScreen" component={ShoppingCartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}