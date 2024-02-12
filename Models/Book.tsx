export enum Genre {
  FICTION = 'Ficção',
  ADVENTURE = 'Aventura',
  NON_FICTION = 'Não Ficção',
  MYSTERY = 'Mistério',
  ROMANCE = 'Romance',
  SCI_FI = 'Ficção Científica',
  FANTASY = 'Fantasia',
  HORROR = 'Horror',
  BIOGRAPHY = 'Biografia',
  POETRY = 'Poesia',
  SELF_HELP = 'Autoajuda',
  HISTORY = 'História',
  OTHER = 'Outro',
}

export enum TransactionType {
  SALE = 'Venda',
  RENTAL = 'Aluguer',
  TRADE = 'Troca',
}

export interface Book {
  id: number;
  title: string;
  description: string;
  price?: number;
  photos?: string[];
  year: number;
  author: string;
  genre: Genre[];
  transactionType: TransactionType
}