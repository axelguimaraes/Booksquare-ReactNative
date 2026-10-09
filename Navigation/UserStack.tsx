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
import ProfileOtherUsers from '../Screens/Profile/ProfileOtherUsers';
import { Book } from '../Models/Book';
import CheckoutScreen from '../Screens/Shopping/CheckoutScreen';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';
import { navigationTheme } from './theme';

export type StackNavigationParamsList = {
  Home: undefined
  Notifications: undefined
  Search: undefined
  Messages: undefined
  Profile: undefined
  EditProfileScreen: undefined
  ProfileOtherUsers: { userId: string }
  Sell: undefined
  ShoppingCartScreen: undefined
  // book: the listing the conversation started from, shown above the messages
  ChatScreen: { currentUser: string, otherUser: string, book?: Book | null }
  RentForm: { book: Book }
  TradeForm: { book: Book }
  CheckoutScreen: undefined
}

const Stack = createStackNavigator<StackNavigationParamsList>();

export default function UserStack() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator id="UserStack" initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Profile" component={UserProfileScreen} />
        <Stack.Screen name="ProfileOtherUsers" component={ProfileOtherUsers} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="Sell" component={AddBook} />
        <Stack.Screen name="ShoppingCartScreen" component={ShoppingCartScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="RentForm" component={RentForm} />
        <Stack.Screen name="TradeForm" component={TradeForm} />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}