import { mocks } from '../config/dataSources';
import * as firebaseImpl from './firebase/ChatService';
import * as mockImpl from './mock/ChatService';

// Firebase or mock implementation, chosen by EXPO_PUBLIC_MOCK_CHAT (see config/dataSources.ts).
const impl: typeof firebaseImpl = mocks.chat ? mockImpl : firebaseImpl;

export const {
  getChat,
  getAllUserChats,
  subscribeToChat,
  sendSingleMessage,
  markAllMessagesAsRead,
} = impl;
