import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

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

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIREBASE_DB = getFirestore(FIREBASE_APP)