import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import BookCard from '../../Components/BookCard';
import { getAllBooks, subscribeToBooks } from '../../Services/BooksService';
import { Book, TransactionType } from '../../Models/Book';
import { addToCart } from '../../Services/ShoppingCartService';
import { FIREBASE_AUTH } from '../../config/firebase';

const BuyScreen: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    const fetchBooks = async () => {
      try {
        const fetchedBooks: Book[] = await getAllBooks(TransactionType.SALE);
        setBooks(fetchedBooks);
        setLoading(false); // Set loading to false after fetching books
        subscribeToBooks(TransactionType.SALE, handleBookUpdate);
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

  const addBookToCart = (book: Book) => {
    if (FIREBASE_AUTH.currentUser.isAnonymous) {
      alert('Inicie sessão com uma conta para benificiar de todas as funcionalidades.')
      return
    }
    addToCart(FIREBASE_AUTH.currentUser.uid, book)
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
              <Text style={styles.message}>Sem livros disponíveis para comprar.</Text>
            </View>
          ) : (
            <FlatList
              data={books}
              renderItem={({ item }) => <BookCard book={item} onActionButton={() => addBookToCart(item)} />}
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
    fontSize: 18
  },
});

export default BuyScreen;
