import { Transaction } from "../../Models/Transaction";
import { mockStore } from "./mockStore";

export const createTransaction = async (transactionData: Transaction) => {
  await mockStore.write('transactions', (transactions) => {
    if (transactions.some((transaction) => transaction.id === transactionData.id)) {
      throw new Error('A transaction with the same ID already exists.');
    }
    return [...transactions, transactionData];
  });
  return transactionData.id;
};

export const getAllUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const transactions = await mockStore.read('transactions');
  return transactions.filter((transaction) => transaction.idSender === userId || transaction.idReceiver === userId);
};
