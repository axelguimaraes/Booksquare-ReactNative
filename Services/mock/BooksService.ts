import uuid from 'react-native-uuid';
import { Book, TransactionType } from "../../Models/Book";
import { MockData } from "../../DummyData/MockData";
import { mockStore } from "./mockStore";

const visibleBooks = (books: MockData['books'], transactionType?: TransactionType) =>
  books.filter((book) => book.isVisible && (!transactionType || book.transactionType === transactionType));

export const getAllBooks = async (transactionType?: TransactionType): Promise<Book[]> => {
  return visibleBooks(await mockStore.read('books'), transactionType);
};

export const subscribeToBooks = (transactionType, onUpdate) => {
  return mockStore.subscribe('books', (books) => onUpdate(visibleBooks(books, transactionType)));
};

export const getBookByIsbn = async (isbn: number): Promise<Book | null> => {
  const books = await mockStore.read('books');
  return books.find((book) => book.isbn === isbn) ?? null;
};

export const addBook = async (book: Book) => {
  const id = uuid.v4().toString();
  await mockStore.write('books', (books) => {
    if (books.some((b) => b.isbn === book.isbn && b.currentOwner === book.currentOwner)) {
      throw new Error('A book with the same ISBN already exists.');
    }
    return [...books, { ...book, id }];
  });
  return id;
};

// Applies `changes` to one book, after `check` has had the chance to reject the operation.
const updateBook = async (bookId: string, check: (book: Book) => void, changes: Partial<Book>) => {
  await mockStore.write('books', (books) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    check(book);
    return books.map((b) => (b.id === bookId ? { ...b, ...changes } : b));
  });
};

export const rentBook = async ({ bookId, userId, date }): Promise<void> => {
  try {
    await updateBook(bookId, (book) => {
      if (book.rented != null) throw new Error('Book is already rented');
      if (book.traded != null) throw new Error('Book is already traded');
    }, {
      rented: { isRentedTo: userId, rentStartDate: new Date(), rentEndDate: date },
      isVisible: false,
    });
  } catch (error) {
    console.error('Error renting book:', error);
    throw error;
  }
};

export const tradeBook = async ({ bookId, userId, isbn, tradedByPhotos }: { bookId: string, userId: string, isbn: number, tradedByPhotos: string[] }): Promise<void> => {
  try {
    await updateBook(bookId, (book) => {
      if (book.traded != null) throw new Error('Book is already traded');
    }, {
      traded: { isTradedWith: userId, tradedByISBN: isbn, tradedByPhotos },
      isVisible: false,
    });
  } catch (error) {
    console.error('Error trading book:', error);
    throw error;
  }
};

export const purchaseBook = async ({ isbn, buyerId, buyerName }: { isbn: number, buyerId: string, buyerName: string }): Promise<void> => {
  await mockStore.write('books', (books) => {
    const book = books.find((b) => b.isbn === isbn);
    if (!book || !book.isVisible || book.currentOwner === buyerId) {
      return books;
    }
    return books.map((b) => (b === book ? { ...b, isVisible: false, currentOwner: buyerName } : b));
  });
};
