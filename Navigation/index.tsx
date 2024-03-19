import React, { useEffect, useState } from 'react';
import UserStack from './UserStack';
import AuthStack from './AuthStack';
import { FIREBASE_AUTH } from '../config/firebase';

export default function RootNavigation() {
 const [initializing, setInitializing] = useState(true);
 const [user, setUser] = useState();

 function onAuthStateChanged(user) {
   setUser(user);
   if (initializing) setInitializing(false);
 }

 useEffect(() => {
   const subscriber = FIREBASE_AUTH.onAuthStateChanged(onAuthStateChanged);
   return subscriber; 
 }, []);

 if (initializing) return null;

  return user ? <UserStack /> : <AuthStack />;
}