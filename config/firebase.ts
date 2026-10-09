import Constants from 'expo-constants';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Firebase is initialized on first use, so features running on mocks never touch it
// and the app starts without any FIREBASE_* variables set.
let auth: Auth | undefined;

const getFirebaseApp = (): FirebaseApp => {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Set the FIREBASE_* variables in .env, ' +
      'or switch this feature to mocks in .env.local (see .env.example).'
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

export const getFirebaseAuth = (): Auth => {
  auth ??= initializeAuth(getFirebaseApp(), {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  return auth;
};

export const getFirestoreDb = (): Firestore => getFirestore(getFirebaseApp());

export const getFirebaseStorage = (): FirebaseStorage => getStorage(getFirebaseApp());
