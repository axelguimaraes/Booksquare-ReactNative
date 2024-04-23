import { CollectionReference, DocumentData, Query, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { User } from "../Models/User";
import { FIREBASE_DB } from "../config/firebase";

export const addUser = async (userData: User): Promise<void> => {
  try {
    const docRef = await addDoc(collection(FIREBASE_DB, 'users'), userData)
    console.log('User added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding user: ', error);
    throw new Error('Error adding user');
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const usersCollection = collection(FIREBASE_DB, 'users');
    let usersQuery: CollectionReference<DocumentData, DocumentData> | Query<DocumentData>;
    usersQuery = query(usersCollection, where('userId', '==', userId))
    const querySnapshot = await getDocs(usersQuery)

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    const userData = querySnapshot.docs[0].data() as User;
    return userData;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error('Error getting user by ID');
  }
};

// Function to get a user from Firestore by display name
export const getUserByDisplayName = async (displayName: string): Promise<User | null> => {
  try {
    const usersCollection = collection(FIREBASE_DB, 'users');
    let usersQuery: CollectionReference<DocumentData, DocumentData> | Query<DocumentData>;
    usersQuery = query(usersCollection, where('displayName', '==', displayName))
    const querySnapshot = await getDocs(usersQuery)

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    const userData = querySnapshot.docs[0].data() as User;
    return userData;
  } catch (error) {
    console.error('Error getting user by display name:', error);
    throw new Error('Error getting user by display name');
  }
};

export const getUserIdByDisplayName = async (displayName: string): Promise<string | null> => {
  try {
    const usersRef = collection(FIREBASE_DB, 'users');
    const q = query(usersRef, where('displayName', '==', displayName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData.userId;
    } else {
      console.log('No user found with the specified display name');
      return null;
    }
  } catch (error) {
    console.error('Error getting user ID by display name: ', error);
    throw new Error('Error getting user ID by display name');
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(FIREBASE_DB, 'users', userId), userData);
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user: ', error);
    throw new Error('Error updating user');
  }
};

export const updateUserById = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    // Construct a query to find the user document based on userId
    const usersRef = collection(FIREBASE_DB, 'users');
    const userQuery = query(usersRef, where('userId', '==', userId));

    // Execute the query to find the document
    const querySnapshot = await getDocs(userQuery);

    // If there is a matching document, update it
    if (!querySnapshot.empty) {
      // Get the document reference from the query snapshot
      const userDocRef = doc(FIREBASE_DB, 'users', querySnapshot.docs[0].id);

      // Update the document with the provided data
      await updateDoc(userDocRef, userData);
      console.log('User updated successfully');
    } else {
      console.log('No matching document found for userId:', userId);
    }
  } catch (error) {
    console.error('Error updating user: ', error);
    throw new Error('Error updating user');
  }
};

// Function to delete a user from Firestore
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(FIREBASE_DB, 'users', userId));
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user: ', error);
    throw new Error('Error deleting user');
  }
};
