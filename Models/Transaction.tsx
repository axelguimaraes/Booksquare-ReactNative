import { Book, TransactionType } from "./Book";

export interface Transaction {
    id: string,
    timestamp: number,
    book: Book
    idSender: string,
    idReceiver: string,
    transactionType: TransactionType,
}