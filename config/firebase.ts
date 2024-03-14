import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore"
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  webClientId: Constants.expoConfig?.extra.webClientId,
  webClientSecretKey: Constants.expoConfig?.extra?.webClientSecretKey,
  googleApiKey: Constants.expoConfig?.extra?.googleApiKey 
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
const FIREBASE_DB = getFirestore(FIREBASE_APP)
export { firebase, FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB }