import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import BookCard from '../../Components/BookCard';
import { getAllBooks, subscribeToBooks } from '../../Services/BooksService';
import { Book, TransactionType } from '../../Models/Book';
import { NavigationProp } from '@react-navigation/native';

interface RentScreenProps {
  navigation: NavigationProp<any>;
}

const RentScreen: React.FC<RentScreenProps> = ({ navigation }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    const fetchBooks = async () => {
      try {
        const fetchedBooks: Book[] = await getAllBooks(TransactionType.RENTAL);
        setBooks(fetchedBooks);
        setLoading(false); // Set loading to false after fetching books
        subscribeToBooks(TransactionType.RENTAL, handleBookUpdate);
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

  const handleActionButton = (item: Book) => {
    navigation.navigate('RentForm', { book: item });
  }

  return (
    <View>
      {loading ? ( // Display a loading indicator while fetching books
        <Text style={styles.message}>A carregar...</Text>
      ) : books.length === 0 ? ( // Display a message if books list is empty
        <View style={styles.container}>
          <Text style={styles.message}>Sem livros disponíveis para alugar.</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={({ item }) => <BookCard book={item} onActionButton={() => handleActionButton(item)} />}
          keyExtractor={(item) => item.isbn.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 18
  },
});

export default RentScreen;
