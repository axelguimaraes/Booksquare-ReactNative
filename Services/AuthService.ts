import { mocks } from '../config/dataSources';
import * as firebaseImpl from './firebase/AuthService';
import * as mockImpl from './mock/AuthService';

// Firebase or mock implementation, chosen by EXPO_PUBLIC_MOCK_AUTH (see config/dataSources.ts).
const impl: typeof firebaseImpl = mocks.auth ? mockImpl : firebaseImpl;

export const {
  loginWithEmailAndPassword,
  loginAnonymously,
  registerWithEmailAndPassword,
  getCurrentUser,
  onAuthStateChanged,
  logout,
  updateCurrentUserProfile,
  updateCurrentUserEmail,
} = impl;
