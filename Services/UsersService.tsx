import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
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
    const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User
    } else {
      console.log('No such document')
      return null
    }
  } catch (error) {
    console.error('Error getting user: ', error);
    throw new Error('Error getting user');
  }
};

// Function to get a user from Firestore by display name
export const getUserByDisplayName = async (displayName: string): Promise<User | null> => {
  try {
    const usersRef = collection(FIREBASE_DB, 'users');
    const q = query(usersRef, where('displayName', '==', displayName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data() as User;
      return { id: querySnapshot.docs[0].id, ...userData };
    } else {
      console.log('No user found with the specified display name');
      return null;
    }
  } catch (error) {
    console.error('Error getting user by display name: ', error);
    throw new Error('Error getting user by display name');
  }
};

export const getUserIdByDisplayName = async (displayName: string): Promise<string | null> => {
  try {
    const usersRef = collection(FIREBASE_DB, 'users');
    const q = query(usersRef, where('displayName', '==', displayName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
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