import { mocks } from '../config/dataSources';
import * as firebaseImpl from './firebase/TransactionsService';
import * as mockImpl from './mock/TransactionsService';

// Firebase or mock implementation, chosen by EXPO_PUBLIC_MOCK_TRANSACTIONS (see config/dataSources.ts).
const impl: typeof firebaseImpl = mocks.transactions ? mockImpl : firebaseImpl;

export const {
  createTransaction,
  getAllUserTransactions,
} = impl;
