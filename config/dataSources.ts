import { isFirebaseConfigured } from './firebase';

// Chooses, per feature, whether the services use the mock implementations or the real backends.
// Set EXPO_PUBLIC_MOCK_<FEATURE>=true|false in .env.local (see .env.example) and restart Expo.
// Firebase-backed features default to mocks when Firebase isn't configured, and to the real
// backend when it is. Expo only inlines EXPO_PUBLIC_* variables accessed statically, which is
// why each one is spelled out below.

const parseFlag = (name: string, value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value.trim() === '') return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  console.warn(`[dataSources] ${name}="${value}" is not true/false; using ${fallback}.`);
  return fallback;
};

const firebaseDefault = !isFirebaseConfigured;

export const mocks = {
  auth: parseFlag('EXPO_PUBLIC_MOCK_AUTH', process.env.EXPO_PUBLIC_MOCK_AUTH, firebaseDefault),
  users: parseFlag('EXPO_PUBLIC_MOCK_USERS', process.env.EXPO_PUBLIC_MOCK_USERS, firebaseDefault),
  books: parseFlag('EXPO_PUBLIC_MOCK_BOOKS', process.env.EXPO_PUBLIC_MOCK_BOOKS, firebaseDefault),
  cart: parseFlag('EXPO_PUBLIC_MOCK_CART', process.env.EXPO_PUBLIC_MOCK_CART, firebaseDefault),
  chat: parseFlag('EXPO_PUBLIC_MOCK_CHAT', process.env.EXPO_PUBLIC_MOCK_CHAT, firebaseDefault),
  transactions: parseFlag('EXPO_PUBLIC_MOCK_TRANSACTIONS', process.env.EXPO_PUBLIC_MOCK_TRANSACTIONS, firebaseDefault),
  storage: parseFlag('EXPO_PUBLIC_MOCK_STORAGE', process.env.EXPO_PUBLIC_MOCK_STORAGE, firebaseDefault),
  // The Google Books lookup needs no keys, so it stays real unless asked otherwise.
  bookLookup: parseFlag('EXPO_PUBLIC_MOCK_BOOK_LOOKUP', process.env.EXPO_PUBLIC_MOCK_BOOK_LOOKUP, false),
};

// Keep mock data (including the signed-in mock session) in AsyncStorage across reloads.
// Set to false to start from the seed data on every launch.
export const persistMockData = parseFlag('EXPO_PUBLIC_MOCK_PERSIST', process.env.EXPO_PUBLIC_MOCK_PERSIST, true);

const mocked = Object.keys(mocks).filter((feature) => mocks[feature]);
const real = Object.keys(mocks).filter((feature) => !mocks[feature]);
console.log(
  `[dataSources] Firebase ${isFirebaseConfigured ? 'configured' : 'not configured'} | ` +
  `mock: ${mocked.join(', ') || 'none'} | real: ${real.join(', ') || 'none'}`
);
