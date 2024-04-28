import React, { useEffect, useState } from 'react';
import UserStack from './UserStack';
import AuthStack from './AuthStack';
import { FIREBASE_AUTH } from '../config/firebase';

export default function RootNavigation() {
 const [initializing, setInitializing] = useState(true);
 const [user, setUser] = useState();

 function onAuthStateChanged(user) {
   if (!user) {
     // No user found, perform logout action
     FIREBASE_AUTH.signOut()
       .then(() => {
         // Clear user state and stop initializing
         setUser(null);
         setInitializing(false);
       })
       .catch((error) => {
         console.error("Error signing out:", error);
         // You might want to handle this error scenario
       });
   } else {
     // User found, set user state and stop initializing
     setUser(user);
     setInitializing(false);
   }
 }

 useEffect(() => {
   const subscriber = FIREBASE_AUTH.onAuthStateChanged(onAuthStateChanged);
   return subscriber; 
 }, []);

 if (initializing) return null;

 return user ? <UserStack /> : <AuthStack />;
}
