export enum TransactionType {
  SALE = 'Venda',
  RENTAL = 'Aluguer',
  TRADE = 'Troca',
}

export interface Rented {
  isRentedTo: string,
  rentStartDate?: Date,
  rentEndDate?: Date,
}

export interface Traded {
  isTradedWith: string
  tradedByISBN: number
  tradedByPhotos: string[]
}

export interface Book {
  isbn: number;
  title: string;
  description: string;
  price?: number;
  rentalPricePerDay?: number
  photos: string[];
  year: number;
  author: string;
  genre: string[];
  transactionType: TransactionType
  currentOwner: string
  isVisible: boolean,

  rented?: Rented
  traded?: Traded
}