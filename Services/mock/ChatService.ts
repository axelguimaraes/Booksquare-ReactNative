import uuid from 'react-native-uuid'
import { Chat, SingleMessage } from "../../Models/Chat";
import { addChatToUser, getUserById } from "../UsersService";
import { mockStore } from "./mockStore";

const findChat = (chats: Chat[], userId: string, otherUserId: string): Chat | null =>
  chats.find((chat) =>
    (chat.user1 === userId && chat.user2 === otherUserId) || (chat.user1 === otherUserId && chat.user2 === userId)
  ) ?? null;

export const getChat = async (userId: string, otherUserId: string): Promise<Chat | null> => {
  return findChat(await mockStore.read('chats'), userId, otherUserId);
};

export const getAllUserChats = async (userId: string): Promise<Chat[]> => {
  const user = await getUserById(userId);
  if (!user) {
    console.error('Error fetching chats for user: User not found');
    throw new Error('Error fetching chats for user');
  }

  const chatIDs = user.chatID || [];
  const chats = await mockStore.read('chats');
  return chats.filter((chat) => chatIDs.includes(chat.id));
};

// Like the Firebase version, creates the chat (and links it to both users) if it doesn't exist yet.
export const subscribeToChat = (userId: string, otherUserId: string, onUpdate: (chat: Chat | null) => void) => {
  let creating = false;

  return mockStore.subscribe('chats', async (chats) => {
    const chat = findChat(chats, userId, otherUserId);
    if (chat) {
      onUpdate(chat);
      return;
    }
    if (creating) return;

    creating = true;
    try {
      const newChat: Chat = { id: uuid.v4().toString(), user1: userId, user2: otherUserId, messageThread: [] };
      await mockStore.write('chats', (current) => [...current, newChat]);
      await addChatToUser(userId, newChat.id);
      await addChatToUser(otherUserId, newChat.id);
    } catch (error) {
      console.error('Error creating chat document:', error);
      onUpdate(null);
    }
  });
};

export const sendSingleMessage = async (chat: Chat, newMessage: SingleMessage): Promise<void> => {
  await mockStore.write('chats', (chats) =>
    chats.map((c) => (c.id === chat.id ? { ...c, messageThread: [...c.messageThread, newMessage] } : c))
  );
};

export const markAllMessagesAsRead = async (chatId: string, userId: string): Promise<void> => {
  await mockStore.write('chats', (chats) =>
    chats.map((chat) => chat.id !== chatId ? chat : {
      ...chat,
      messageThread: chat.messageThread.map((message) =>
        message.receiverID === userId && !message.isRead ? { ...message, isRead: true } : message
      ),
    })
  );
};
