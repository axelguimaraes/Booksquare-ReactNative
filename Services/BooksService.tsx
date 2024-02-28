import { Book, TransactionType } from "../Models/Book";
import DummyBooks from "../DummyData/Books";
import { FIREBASE_DB } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

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
export const getBookById = (id: string): Promise<Book> => {
  // Simulate an asynchronous call to a database
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = DummyBooks.find((book) => book.id === id);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 500);
  });
};

export const getBookInfoByISBN = async (isbn) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    const data = await response.json();
    return data.items[0]
  } catch (error) {
    console.error("Error fetching book info:", error);
    return null
  }
}

export const populateBookFromJson = (json: any): Book => {
  const genres: string[] = json.volumeInfo.categories || [];

  const photos: string[] = json.volumeInfo.imageLinks 
    ? [json.volumeInfo.imageLinks.thumbnail] 
    : [];

  return {
    id: json.volumeInfo.id,
    isbn: parseInt(json.id, 10),
    title: json.volumeInfo.title,
    description: json.volumeInfo.description,
    price: undefined,
    photos: photos,
    year: new Date(json.volumeInfo.publishedDate).getFullYear(),
    author: json.volumeInfo.authors.join(', '),
    genre: genres,
    transactionType: undefined,
    currentOwner: undefined
  };
};

export const addBook = async (book: Book) => {
  try {
    const { id, ...bookData } = book;

    const docRef = await addDoc(collection(FIREBASE_DB, "books"), bookData);
    console.log('Book added with ID: ', docRef.id)
    return  docRef.id;
  } catch (error) {
    console.log(error)
    throw error
  }
}