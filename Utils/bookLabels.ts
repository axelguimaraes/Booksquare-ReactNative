import { Book, TransactionType } from '../Models/Book';
import { formatPrice } from './format';

// What a listing costs, as shown on cards and summaries.
export const getPriceLabel = (book: Book): string => {
  switch (book.transactionType) {
    case TransactionType.SALE:
      return book.price != null ? formatPrice(book.price) : '';
    case TransactionType.RENTAL:
      return book.rentalPricePerDay != null ? `${formatPrice(book.rentalPricePerDay)}/dia` : '';
    case TransactionType.TRADE:
      return 'Para troca';
    default:
      return '';
  }
};

// Label of the main action for a listing.
export const getActionLabel = (transactionType: TransactionType): string => {
  switch (transactionType) {
    case TransactionType.SALE:
      return 'Adicionar ao carrinho';
    case TransactionType.RENTAL:
      return 'Alugar';
    default:
      return 'Propor troca';
  }
};

export const getActionIcon = (transactionType: TransactionType) => {
  switch (transactionType) {
    case TransactionType.SALE:
      return 'cart-outline' as const;
    case TransactionType.RENTAL:
      return 'calendar-outline' as const;
    default:
      return 'swap-horizontal' as const;
  }
};
