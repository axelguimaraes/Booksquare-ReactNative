import { Book, Traded, TransactionType } from "../Models/Book";
import { FIREBASE_DB } from "../config/firebase";
import { collection, addDoc, getDocs, Query, query, where, CollectionReference, DocumentData, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';

// Function to fetch all books from the database
export const getAllBooks = async (transactionType?: TransactionType): Promise<Book[]> => {
  console.log('Getting all books')
  try {
    const booksCollection = collection(FIREBASE_DB, 'books');
    let booksQuery: CollectionReference<DocumentData, DocumentData> | Query<DocumentData>;

    if (transactionType) {
      booksQuery = query(booksCollection, where('transactionType', '==', transactionType), where('isVisible', '==', true));
    } else {
      booksQuery = query(booksCollection, where('isVisible', '==', true));
    }

    const querySnapshot = await getDocs(booksQuery);
    const books: Book[] = [];

    querySnapshot.forEach((doc) => {
      books.push(doc.data() as Book);
    });


    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const subscribeToBooks = (transactionType, onUpdate) => {
  console.log('Subscribing to books')
  const booksRef = collection(FIREBASE_DB, 'books');

  // Create a query to filter books by transaction type
  const transactionTypeQuery = query(booksRef, where('transactionType', '==', transactionType), where('isVisible', '==', true));

  // Subscribe to real-time updates
  const unsubscribe = onSnapshot(transactionTypeQuery, (snapshot) => {
    const updatedBooks = []; // Array to store updated books

    // Iterate through each document in the snapshot
    snapshot.forEach((doc) => {
      // Get the book data from the document
      const bookData = doc.data();
      // Add the book data to the updatedBooks array
      updatedBooks.push({
        id: doc.id, // Assuming each book document has an 'id' field
        ...bookData,
      });
    });

    // Invoke the onUpdate callback with the updatedBooks array
    onUpdate(updatedBooks);
  });

  // Return the unsubscribe function to stop listening to updates
  return unsubscribe;
};


export const getBookInfoByISBN = async (isbn) => {
  console.log('Getting book info by ISBN')
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    const data = await response.json();
    return data.items[0]
  } catch (error) {
    console.error("Error fetching book info:", error);
    return null
  }
}

export const getBookByIsbn = async (isbn: number): Promise<Book | null> => {
  console.log('Getting book by ISBN');
  try {
    const booksCollection = collection(FIREBASE_DB, 'books');
    const booksQuery = query(booksCollection, where('isbn', '==', isbn));
    const querySnapshot = await getDocs(booksQuery);

    if (!querySnapshot.empty) {
      const bookData = querySnapshot.docs[0].data() as Book;
      return bookData
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
};

export const populateBookFromJson = (json: any): Book => {
  console.log('populating book from JSON')
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
    transactionType: null,
    currentOwner: null,
    isVisible: true,
  };
};

export const addBook = async (book: Book) => {
  console.log('Adding book')
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

export const rentBook = async ({ bookId, userId, date }): Promise<void> => {
  console.log('Renting book')
  try {
    const bookRef = doc(FIREBASE_DB, 'books', bookId);

    const bookSnapshot = await getDoc(bookRef);

    if (!bookSnapshot.exists()) {
      throw new Error('Book not found');
    }

    const bookData = bookSnapshot.data() as Book;

    if (bookData.rented != null) {
      throw new Error('Book is already rented');
    }

    if (bookData.traded != null) {
      throw new Error('Book is already traded');
    }

    await updateDoc(bookRef, {
      rented: {
        isRentedTo: userId,
        rentStartDate: new Date(),
        rentEndDate: date,
      },
      isVisible: false,
    });


    console.log('Book rented successfully');
  } catch (error) {
    console.error('Error renting book:', error);
    throw error;
  }
};

export const tradeBook = async ({ bookId, userId, isbn, tradedByPhotos }: { bookId: string, userId: string, isbn: number, tradedByPhotos: string[] }): Promise<void> => {
  console.log('Trading book')
  try {
    const bookRef = doc(FIREBASE_DB, 'books', bookId);
    const bookSnapshot = await getDoc(bookRef);

    if (!bookSnapshot.exists()) {
      throw new Error('Book not found');
    }

    const bookData = bookSnapshot.data() as { traded?: Traded, currentOwner: string };

    if (bookData.traded != null) {
      throw new Error('Book is already traded');
    }

    await updateDoc(bookRef, {
      traded: {
        isTradedWith: userId, // Set the user ID who the book is traded with
        tradedByISBN: isbn, // Set the ISBN of the book being traded by the current user
        tradedByPhotos, // Set the photos of the book being traded by the current user
      },
      isVisible: false, // Mark the book as unavailable for trade
    });

    console.log('Book traded successfully');
  } catch (error) {
    console.error('Error trading book:', error);
    throw error;
  }
};