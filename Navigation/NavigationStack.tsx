import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../Screens/Home/Home";
import Search from "../Screens/Search/Search";
import Messages from "../Screens/Messages/Messages";
import Profile from "../Screens/Profile/Profile";
import Sell from "../Screens/AddBook/AddBook";
import ShoppingCartScreen from "../Screens/Shopping/ShoppingCartScreen";
import Notifications from "../Screens/Notifications/Notifications";
import ChatScreen from "../Screens/Messages/ChatScreen";
import LoginScreen from "../Screens/Authentication/LoginScreen";
import RegisterScreen from "../Screens/Authentication/RegisterScreen";
import WelcomeScreen from "../Screens/Authentication/WelcomeScreen";

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Sell" component={Sell} options={{ headerShown: false }} />
        <Stack.Screen name="ShoppingCartScreen" component={ShoppingCartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}