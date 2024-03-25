import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import BookDetailsDialog from './BookDetailsDialog'; // Import the BookDetailsDialog component
import { Book, TransactionType } from '../Models/Book';

interface Props {
  book: Book;
  onActionButton: () => Promise<void> | void
}

const BookCard: React.FC<Props> = ({ book, onActionButton }) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleOpenDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleActionButton = () => {
    onActionButton();
    handleCloseDialog();
  }

  return (
    <>
      <TouchableOpacity onPress={handleOpenDialog}>
        <View style={styles.container}>
          <Image source={{ uri: book.photos[0] }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.authorYear}>{book.author}, {book.year}</Text>
            <View style={styles.tagsContainer}>
              {book.genre.map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
            </View>
            <Text style={styles.currentOwner}>publicado por: {book.currentOwner}</Text>
            {book.transactionType === TransactionType.SALE && book.price &&
                <Text style={styles.price}>Preço: {book.price}€</Text>
              }
          </View>
        </View>
      </TouchableOpacity>
      <BookDetailsDialog
        book={book}
        visible={dialogVisible}
        onClose={handleCloseDialog}
        onActionButton={handleActionButton}
        hasTransactionType={book.transactionType !== null}
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
  authorYear: {
    fontSize: 14,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#DADADA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 8,
  },
  currentOwner: {
    color: 'grey',
    fontStyle: 'italic'
  }
});

export default BookCard;
