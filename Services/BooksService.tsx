import { Book, TransactionType } from "../Models/Book";
import DummyBooks from "../DummyData/Books";
import { FIREBASE_DB } from "../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

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

  const booksQuery = query(collection(FIREBASE_DB, 'books'),
    where('isbn', '==', book.isbn),
    where('currentOwner', '==', book.currentOwner)
  );
  const booksSnapshot = await getDocs(booksQuery);

  if (!booksSnapshot.empty) {
    throw new Error('A book with the same ISBN already exists.');
  }

  const docRef = await addDoc(collection(FIREBASE_DB, 'books'), book);
  return docRef.id;
}