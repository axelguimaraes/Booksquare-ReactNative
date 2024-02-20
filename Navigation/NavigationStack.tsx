import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../Auth/AuthContext';
import LoginScreen from '../Screens/Authentication/LoginScreen';
import RegisterScreen from '../Screens/Authentication/RegisterScreen';
import Home from '../Screens/Home/Home';
import Search from '../Screens/Search/Search';
import Messages from '../Screens/Messages/Messages';
import Profile from '../Screens/Profile/Profile';
import Sell from '../Screens/AddBook/AddBook';
import ShoppingCartScreen from '../Screens/Shopping/ShoppingCartScreen';
import Notifications from '../Screens/Notifications/Notifications';
import ChatScreen from '../Screens/Messages/ChatScreen';
import Login from '../Screens/Authentication/Login';

const Stack = createStackNavigator();

const AppNavigation: React.FC = () => {
  const { user } = useAuth(); // Get the user from AuthContext

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Conditionally render screens based on user authentication */}
        {user ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Sell" component={Sell} options={{ headerShown: false }} />
            <Stack.Screen name="ShoppingCartScreen" component={ShoppingCartScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
