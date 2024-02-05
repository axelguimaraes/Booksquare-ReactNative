import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import BookDetailsDialog from './BookDetailsDialog'; // Import the BookDetailsDialog component
import { Book } from '../Models/Book';

interface Props {
  book: Book;
}

const BookCard: React.FC<Props> = ({ book }) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleOpenDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handleOpenDialog}>
        <View style={styles.container}>
          <Image source={{ uri: book.photos[0] }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.description}>{book.description}</Text>
            <Text style={styles.price}>{book.price}€</Text>
          </View>
        </View>
      </TouchableOpacity>
      <BookDetailsDialog
        book={book}
        visible={dialogVisible}
        onClose={handleCloseDialog}
        onAddToCart={() => console.log('Add to Cart')} // Add your logic for adding to cart here
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookCard;
