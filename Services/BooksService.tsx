import { Book, TransactionType, Genre } from "../Models/Book";
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
  const genres: Genre[] = json.volumeInfo.categories?.map((category: string) => {
    // Map category strings to Genre enum values, or use a default value
    switch (category) {
      case 'Fiction':
        return Genre.FICTION;
      case 'Adventure':
        return Genre.ADVENTURE;
      // Add more cases for other categories
      default:
        return Genre.OTHER;
    }
  }) || [Genre.OTHER]; // Default to OTHER if no categories are available

  return {
    id: 1, // You can set an ID if needed
    isbn: parseInt(json.id, 10), // Assuming 'id' in JSON is an integer
    title: json.volumeInfo.title,
    description: json.volumeInfo.description,
    price: undefined, // Set as needed
    photos: [], // Set as needed
    year: new Date(json.volumeInfo.publishedDate).getFullYear(),
    author: json.volumeInfo.authors.join(', '),
    genre: genres,
    transactionType: TransactionType.SALE, // Set as needed
  };
};