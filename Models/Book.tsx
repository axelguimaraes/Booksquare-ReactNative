export enum TransactionType {
  SALE = 'Venda',
  RENTAL = 'Aluguer',
  TRADE = 'Troca',
}

export interface Book {
  isbn: number;
  title: string;
  description: string;
  price?: number;
  photos: string[];
  year: number;
  author: string;
  genre: string[];
  transactionType: TransactionType
  currentOwner: string
  isVisible: boolean,

  rentalPricePerDay?: number
  isRentedTo: string,
  rentStartDate?: Date,
  rentEndDate?: Date,

  isTradedWith: string
}