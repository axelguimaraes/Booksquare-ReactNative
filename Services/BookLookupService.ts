import { mocks } from '../config/dataSources';
import { Book } from '../Models/Book';
import * as googleBooksImpl from './googleBooks/BookLookupService';
import * as mockImpl from './mock/BookLookupService';

// Google Books or mock implementation, chosen by EXPO_PUBLIC_MOCK_BOOK_LOOKUP (see config/dataSources.ts).
const impl: typeof googleBooksImpl = mocks.bookLookup ? mockImpl : googleBooksImpl;

export const { getBookInfoByISBN } = impl;

export const populateBookFromJson = (json: any): Book => {
  console.log('populating book from JSON')
  const genres: string[] = json.volumeInfo.categories || [];

  const photos: string[] = json.volumeInfo.imageLinks && json.volumeInfo.imageLinks.thumbnail
    ? [json.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')] 
    : [];

  return {
    isbn: parseInt(json.id, 10),
    title: json.volumeInfo.title,
    description: json.volumeInfo.description ?? '',
    price: undefined,
    photos: photos,
    // publishedDate is "2004", "2004-03" or "2004-03-01"
    year: Number.parseInt(json.volumeInfo.publishedDate ?? '', 10) || null,
    author: (json.volumeInfo.authors ?? []).join(', '),
    genre: genres,
    transactionType: null,
    currentOwner: null,
    isVisible: true,
  };
};
