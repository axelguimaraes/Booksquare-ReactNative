import { TransactionType } from "./Book";

export interface Transaction {
    id: number,
    timestamp: string,
    idItem: string,
    idSeller: string,
    idBuyer: string,
    transactionType: TransactionType,
    price?: number
}