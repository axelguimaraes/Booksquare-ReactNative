import { Book, TransactionType } from "../Models/Book";
import { FIREBASE_DB } from "../config/firebase";
import { collection,addDoc, getDocs, Query, query, where, CollectionReference, DocumentData, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';

// Function to fetch all books from the database
export const getAllBooks = async (transactionType?: TransactionType): Promise<Book[]> => {
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
    transactionType: null,
    currentOwner: null,
    isVisible: true,
    isRentedTo: null,
    isTradedWith: null
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

export const rentBook = async ({ bookId, userId, date }): Promise<void> => {
  try {
    const bookRef = doc(FIREBASE_DB, 'books', bookId);

    const bookSnapshot = await getDoc(bookRef);

    if (!bookSnapshot.exists()) {
      throw new Error('Book not found');
    }

    const bookData = bookSnapshot.data() as Book;

    if (bookData.isRentedTo) {
      throw new Error('Book is already rented');
    }
    

    await updateDoc(bookRef, {
      isRentedTo: userId, // Set the user ID who is renting the book
      isVisible: false, // Mark the book as unavailable for rent
      rentStartDate: new Date(), // Set the rent start date to the current date
      rentEndDate: date, // Reset the rent end date
    });


    console.log('Book rented successfully');
  } catch (error) {
    console.error('Error renting book:', error);
    throw error;
  }
};