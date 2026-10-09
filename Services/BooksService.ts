import { mocks } from '../config/dataSources';
import * as firebaseImpl from './firebase/BooksService';
import * as mockImpl from './mock/BooksService';

// Firebase or mock implementation, chosen by EXPO_PUBLIC_MOCK_BOOKS (see config/dataSources.ts).
const impl: typeof firebaseImpl = mocks.books ? mockImpl : firebaseImpl;

export const {
  getAllBooks,
  subscribeToBooks,
  getBookByIsbn,
  addBook,
  rentBook,
  tradeBook,
  purchaseBook,
} = impl;
