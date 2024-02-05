import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import BookCard from '../../Components/BookCard';
import { getAllBooks } from '../../Services/BooksService'; // Import the getAllBooks function from the BooksService
import { Book } from '../../Models/Book';

const BuyScreen: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]); // State to store the fetched books

  useEffect(() => {
    // Fetch books data when the component mounts
    const fetchBooks = async () => {
      try {
        const fetchedBooks: Book[] = await getAllBooks(); // Call the getAllBooks function to fetch books
        setBooks(fetchedBooks); // Set the fetched books in the state
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks(); // Call the fetchBooks function
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={books} // Pass the fetched books data to FlatList
        renderItem={({ item }) => <BookCard book={item} />} // Render each book using BookCard component
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default BuyScreen;
