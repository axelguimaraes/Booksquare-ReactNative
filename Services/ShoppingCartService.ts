import { mocks } from '../config/dataSources';
import * as firebaseImpl from './firebase/ShoppingCartService';
import * as mockImpl from './mock/ShoppingCartService';

// Firebase or mock implementation, chosen by EXPO_PUBLIC_MOCK_CART (see config/dataSources.ts).
const impl: typeof firebaseImpl = mocks.cart ? mockImpl : firebaseImpl;

export const {
  addToCart,
  removeFromCart,
  clearCart,
  getCartItems,
  getCartItemCount,
  listenForCartChanges,
  purchaseItems,
} = impl;
