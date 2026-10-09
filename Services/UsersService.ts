import { mocks } from '../config/dataSources';
import * as firebaseImpl from './firebase/UsersService';
import * as mockImpl from './mock/UsersService';

// Firebase or mock implementation, chosen by EXPO_PUBLIC_MOCK_USERS (see config/dataSources.ts).
const impl: typeof firebaseImpl = mocks.users ? mockImpl : firebaseImpl;

export const {
  addUser,
  getUserById,
  getUserByDisplayName,
  getUserIdByDisplayName,
  updateUser,
  updateUserById,
  addChatToUser,
  deleteUser,
} = impl;
