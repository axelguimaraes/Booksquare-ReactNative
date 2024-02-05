import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import BookCard from '../../Components/BookCard';
import { getAllBooks } from '../../Services/BooksService';
import { Book, TransactionType } from '../../Models/Book';

const TradeScreen: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Fetch books data when the component mounts
    const fetchBooks = async () => {
      try {
        const fetchedBooks: Book[] = await getAllBooks(TransactionType.TRADE); 
        setBooks(fetchedBooks); 
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={books}
        renderItem={({ item }) => <BookCard book={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default TradeScreen;
