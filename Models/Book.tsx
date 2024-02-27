export enum TransactionType {
  SALE = 'Venda',
  RENTAL = 'Aluguer',
  TRADE = 'Troca',
}

export interface Book {
  id: number;
  isbn: number;
  title: string;
  description: string;
  price?: number;
  photos?: string[];
  year: number;
  author: string;
  genre: string[];
  transactionType: TransactionType
}