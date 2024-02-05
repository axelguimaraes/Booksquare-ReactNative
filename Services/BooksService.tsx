import { Book, TransactionType } from "../Models/Book";
import DummyBooks from "../DummyData/Books";

// Function to fetch all books from the database
export const getAllBooks = (transactionType?: TransactionType): Promise<Book[]> => {
  // Simulate an asynchronous call to a database
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredBooks = DummyBooks;
      
      if (transactionType) {
        filteredBooks = DummyBooks.filter(book => book.transactionType === transactionType);
      }

      resolve(filteredBooks);
    }, 1000); // Simulate a delay of 1 second
  });
};


// Function to fetch a single book by its ID from the database
export const getBookById = (id: number): Promise<Book> => {
  // Simulate an asynchronous call to a database
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = DummyBooks.find((book) => book.id === id);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 500); // Simulate a delay of 0.5 seconds
  });
};