import { Transaction } from "../Models/Transaction";
import { FIREBASE_DB } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  Query,
  query,
  where,
  CollectionReference,
  DocumentData,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export const createTransaction = async (transactionData: Transaction) => {
  console.log('Creating transaction')
  const transactionsQuery = query(
    collection(FIREBASE_DB, "transactions"),
    where("id", "==", transactionData.id)
  );
  const transactionsSnapshot = await getDocs(transactionsQuery)

  if (!transactionsSnapshot.empty) {
    throw new Error('A transaction with the same ID already exists.')
  }

  const docRef = await addDoc(collection(FIREBASE_DB, 'transactions'), transactionData)
  return docRef.id
};

// Function to get all transactions by user ID
export const getAllUserTransactions = async (userId: string): Promise<Transaction[]> => {
  console.log('Getting all user transactions')
  try {
    const transactionsCollection = collection(FIREBASE_DB, 'transactions')
    
    // Query documents where 'idSender' matches userId
    const senderQuery = query(
        transactionsCollection,
        where('idSender', '==', userId)
      );
      
      // Query documents where 'idReceiver' matches userId
      const receiverQuery = query(
        transactionsCollection,
        where('idReceiver', '==', userId)
      );
  
      // Execute both queries asynchronously
      const [senderSnapshot, receiverSnapshot] = await Promise.all([
        getDocs(senderQuery),
        getDocs(receiverQuery),
      ]);
  
      // Process the query snapshots and merge the results
      const transactions: Transaction[] = [];
      senderSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const transactionData = doc.data() as Transaction;
        transactions.push(transactionData);
      });
      receiverSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const transactionData = doc.data() as Transaction;
        transactions.push(transactionData);
      });
  
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions.');
    }
  };