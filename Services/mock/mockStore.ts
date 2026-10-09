import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistMockData } from '../../config/dataSources';
import { createMockSeed, MockData } from '../../DummyData/MockData';

const STORAGE_KEY = 'booksquare:mock-data';
// Bump when the seed data or its shape changes, so stale persisted data is replaced.
const SEED_VERSION = 1;
// Simulated network latency, so loading states behave like they do against Firebase.
const LATENCY_MS = 250;

type Key = keyof MockData;

let data: MockData;
let loading: Promise<void> | undefined;
const listeners = new Map<Key, Set<() => void>>();

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS));

// Callers get copies, so they can't mutate the store without going through write().
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const load = async () => {
  if (persistMockData) {
    try {
      const stored = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
      if (stored?.version === SEED_VERSION) {
        data = stored.data;
        return;
      }
    } catch (error) {
      console.warn('[mock] Could not read stored mock data; starting from the seed.', error);
    }
  }
  data = clone(createMockSeed());
};

// Loaded on first use, so nothing touches AsyncStorage when every feature is real.
const ready = () => (loading ??= load());

const save = () => {
  if (!persistMockData) return;
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, data }))
    .catch((error) => console.warn('[mock] Could not save mock data.', error));
};

export const mockStore = {
  read: async <K extends Key>(key: K): Promise<MockData[K]> => {
    await ready();
    await delay();
    return clone(data[key]);
  },

  // `update` receives a copy of the current value and returns the new one; throwing aborts the write.
  // Like Firestore, subscribers are only notified when the value actually changes.
  write: async <K extends Key>(key: K, update: (current: MockData[K]) => MockData[K]): Promise<void> => {
    await ready();
    await delay();
    const next = clone(update(clone(data[key])));
    if (JSON.stringify(next) === JSON.stringify(data[key])) return;
    data[key] = next;
    save();
    listeners.get(key)?.forEach((notify) => notify());
  },

  // Calls `listener` with the current value, then again after every change. Returns an unsubscribe function.
  subscribe: <K extends Key>(key: K, listener: (value: MockData[K]) => void): (() => void) => {
    let active = true;
    const notify = () => {
      if (active) listener(clone(data[key]));
    };
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(notify);
    ready().then(delay).then(notify);
    return () => {
      active = false;
      listeners.get(key).delete(notify);
    };
  },
};
