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
import RentForm from '../Screens/Rent/RentForm';
import TradeForm from '../Screens/Trade/TradeForm';
import { FIREBASE_AUTH } from '../config/firebase';
import ProfileOtherUsers from '../Screens/Profile/ProfileOtherUsers';
import { User } from '../Models/User';
import { Book } from '../Models/Book';

export type StackNavigationParamsList = {
  Home: undefined
  Notifications: undefined
  Search: undefined
  Messages: undefined
  Profile: { userId: string }
  ProfileOtherUsers: { userId: string }
  Sell: undefined
  ShoppingCartScreen: undefined
  ChatScreen: { currentUser: User, otherUser: User, book: Book}
  RentForm: undefined
  TradeForm: undefined
}

const Stack = createStackNavigator<StackNavigationParamsList>();
const user = FIREBASE_AUTH.currentUser

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={UserProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileOtherUsers" component={ProfileOtherUsers} options={{ headerShown: false }} />
        <Stack.Screen name="Sell" component={AddBook} options={{ headerShown: false }} />
        <Stack.Screen name="ShoppingCartScreen" component={ShoppingCartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RentForm" component={RentForm} options={{ headerShown: false }} />
        <Stack.Screen name="TradeForm" component={TradeForm} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}