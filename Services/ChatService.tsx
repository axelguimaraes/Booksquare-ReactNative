import { collection, query, where, getDocs, onSnapshot, addDoc, doc, updateDoc, FieldValue } from "firebase/firestore";
import { FIREBASE_DB } from "../config/firebase";
import uuid from 'react-native-uuid'
import { updateUserById } from "./UsersService";
import firebase from "firebase/compat";
import { Chat, SingleMessage } from "../Models/Chat";

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
  const unsubscribe = onSnapshot(chatQuery, async (snapshot) => {
    if (snapshot.empty) {
      // Create a new chat document if not found
      try {
        const newChatID = uuid.v4().toString();
        const newChatRef = await addDoc(chatsRef, {
          id: newChatID,
          user1: userId,
          user2: otherUserId,
          messageThread: [],
          bookIsbn: '', // You may want to set this to an actual value
        });
        
        await updateUserById(userId, { chatID: (firebase.firestore.FieldValue as any).arrayUnion(newChatID) });
        await updateUserById(otherUserId, {chatID: (firebase.firestore.FieldValue as any).arrayUnion(newChatID)});

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
    // Find the chat document by object ID
    const chatsRef = collection(FIREBASE_DB, 'chats');
    const querySnapshot = await getDocs(query(chatsRef, where('id', '==', chat.id)));

    if (querySnapshot.empty) {
      console.error('Chat document not found with object ID:', chat.id);
      return;
    }

    // Get the document reference
    const chatDoc = querySnapshot.docs[0].ref;

    // Update the chat document with the new message
    await updateDoc(chatDoc, {
      messageThread: [...chat.messageThread, newMessage],
    });

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

