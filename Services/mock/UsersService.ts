import { User } from "../../Models/User";
import { mockStore } from "./mockStore";

// Mock user documents use the userId as their document ID.

export const addUser = async (userData: User): Promise<void> => {
  await mockStore.write('users', (users) => [...users, userData]);
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const users = await mockStore.read('users');
  return users.find((user) => user.userId === userId) ?? null;
};

export const getUserByDisplayName = async (displayName: string): Promise<User | null> => {
  const users = await mockStore.read('users');
  return users.find((user) => user.displayName === displayName) ?? null;
};

export const getUserIdByDisplayName = async (displayName: string): Promise<string | null> => {
  const user = await getUserByDisplayName(displayName);
  return user?.userId ?? null;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  await mockStore.write('users', (users) =>
    users.map((user) => (user.userId === userId ? { ...user, ...userData } : user))
  );
};

export const updateUserById = updateUser;

export const addChatToUser = async (userId: string, chatId: string): Promise<void> => {
  await mockStore.write('users', (users) =>
    users.map((user) => {
      const chatIDs = user.chatID ?? [];
      return user.userId === userId && !chatIDs.includes(chatId) ? { ...user, chatID: [...chatIDs, chatId] } : user;
    })
  );
};

export const deleteUser = async (userId: string): Promise<void> => {
  await mockStore.write('users', (users) => users.filter((user) => user.userId !== userId));
};
