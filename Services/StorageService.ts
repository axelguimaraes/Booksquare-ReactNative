import { mocks } from '../config/dataSources';
import * as firebaseImpl from './firebase/StorageService';
import * as mockImpl from './mock/StorageService';

// Firebase or mock implementation, chosen by EXPO_PUBLIC_MOCK_STORAGE (see config/dataSources.ts).
const impl: typeof firebaseImpl = mocks.storage ? mockImpl : firebaseImpl;

export const {
  uploadMedia,
} = impl;
