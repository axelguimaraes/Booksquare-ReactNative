import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import BookCard from '../../Components/BookCard';
import { getAllBooks, subscribeToBooks } from '../../Services/BooksService';
import { Book, TransactionType } from '../../Models/Book';

const TradeScreen: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    const fetchBooks = async () => {
      try {
        const fetchedBooks: Book[] = await getAllBooks(TransactionType.TRADE);
        setBooks(fetchedBooks);
        setLoading(false); // Set loading to false after fetching books
        subscribeToBooks(TransactionType.TRADE, handleBookUpdate);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchBooks();
  }, []);

  const handleBookUpdate = (updatedBooks: Book[]) => {
    setBooks(updatedBooks);
  };

  const handleActionButton = () => {
    alert("Feature not yet implemented");
  }

  return (
    <>
      {loading ? ( // Display loading indicator while fetching books
        <View style={styles.containerEmpty}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      ) : (
        <View style={styles.container}>
          {books.length === 0 ? (
            <View style={styles.containerEmpty}>
              <Text style={styles.message}>Sem livros disponíveis para trocar.</Text>
            </View>
          ) : (
            <FlatList
              data={books}
              renderItem={({ item }) => <BookCard book={item} onActionButton={handleActionButton} />}
              keyExtractor={(item) => item.isbn.toString()}
            />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 18,
  },
});

export default TradeScreen;
