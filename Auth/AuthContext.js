import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app with
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check authentication status on app load
useEffect(() => {
  const getUserFromStorage = async () => {
    try {
      const userFromStorage = await AsyncStorage.getItem('user');
      if (userFromStorage) {
        setUser(JSON.parse(userFromStorage));
      }
    } catch (error) {
      console.error('Error retrieving user from AsyncStorage:', error);
    }
  };
  getUserFromStorage();
}, []);


  // Login function
  const login = (userData) => {
    setUser(userData);
    AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
