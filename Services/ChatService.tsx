import { User } from "firebase/auth";
import { collection, CollectionReference, DocumentData, Query, query, where, getDocs, onSnapshot, QuerySnapshot, addDoc, doc, updateDoc } from "firebase/firestore";
import { Chat, SingleMessage } from "../Models/Chat";
import { FIREBASE_DB } from "../config/firebase";

export const getChat = async (userId: string, otherUserId: string): Promise<Chat | null> => {
  try {
    const chatsRef = collection(FIREBASE_DB, 'chats');

    // Create a query to find the chat document for the given user pair
    const chatQuery = query(chatsRef, where('user1', 'in', [userId, otherUserId]), where('user2', 'in', [userId, otherUserId]));

    // Execute the query
    const querySnapshot = await getDocs(chatQuery);

    // If no chat document is found, return null
    if (querySnapshot.empty) {
      return null;
    }

    // Get the first chat document from the snapshot
    const chatDoc = querySnapshot.docs[0];
    const chatData = chatDoc.data() as Chat;
    return { id: chatDoc.id, ...chatData };
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw new Error('Error fetching chat');
  }
};



export const subscribeToChat = (userId: string, otherUserId: string, onUpdate: (chat: Chat | null) => void) => {
  const chatsRef = collection(FIREBASE_DB, 'chats');

  // Create a query to find the chat document for the given user pair
  const chatQuery = query(chatsRef, where('user1', 'in', [userId, otherUserId]), where('user2', 'in', [userId, otherUserId]));

  // Subscribe to real-time updates for the chat query
  const unsubscribe = onSnapshot(chatQuery, async (snapshot: QuerySnapshot) => {
    if (snapshot.empty) {
      // Create a new chat document if not found
      try {
        const newChatRef = await addDoc(chatsRef, {
          user1: userId,
          user2: otherUserId,
          messageThread: [],
          bookIsbn: '', // You may want to set this to an actual value
        });
        onUpdate({ id: newChatRef.id, user1: userId, user2: otherUserId, messageThread: [] });
      } catch (error) {
        console.error('Error creating chat document:', error);
        onUpdate(null);
      }
    } else {
      // Get the first chat document from the snapshot
      const chatDoc = snapshot.docs[0];
      const chatData = chatDoc.data() as Chat;
      onUpdate({ id: chatDoc.id, ...chatData });
    }
  });

  // Return the unsubscribe function to stop listening to updates
  return unsubscribe;
};

export const sendSingleMessage = async (chat: Chat, newMessage: SingleMessage): Promise<void> => {
  try {
    // Update the chat document with the new message
    const chatRef = doc(FIREBASE_DB, 'chats', chat.id);
    await updateDoc(chatRef, {
      messageThread: [...chat.messageThread, newMessage],
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};