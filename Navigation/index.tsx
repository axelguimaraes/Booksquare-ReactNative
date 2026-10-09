import React, { useEffect, useState } from 'react';
import UserStack from './UserStack';
import AuthStack from './AuthStack';
import { onAuthStateChanged } from '../Services/AuthService';
import { AuthUser } from '../Models/User';

export default function RootNavigation() {
 const [initializing, setInitializing] = useState(true);
 const [user, setUser] = useState<AuthUser | null>(null);

 useEffect(() => {
   const unsubscribe = onAuthStateChanged((user) => {
     // Show the user stack when signed in, the auth stack otherwise
     setUser(user);
     setInitializing(false);
   });
   return unsubscribe;
 }, []);

 if (initializing) return null;

 return user ? <UserStack /> : <AuthStack />;
}
