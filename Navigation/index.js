import React from 'react';
//import { useAuthentication } from '../Auth/useAuthentication';
import UserStack from './UserStack';
import AuthStack from './AuthStack';

export default function RootNavigation() {
  //const { user } = useAuthentication();
  const user = undefined

  return user ? <UserStack /> : <AuthStack />;
}