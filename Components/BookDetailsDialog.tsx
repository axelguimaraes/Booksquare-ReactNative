import React from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, TransactionType } from '../Models/Book'; // Import modified enums

interface Props {
  book: Book;
  visible: boolean;
  onClose: () => void;
  onActionButton: () => void;
  isToSell: boolean
}

const BookDetailsDialog: React.FC<Props> = ({ book, visible, onClose, onActionButton, isToSell }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Close button (X icon) */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          {/* Photos */}
          <ScrollView horizontal>
            {book.photos && book.photos.length > 0 && (
              <Image source={{ uri: book.photos[0] }} style={styles.bookImage} />
            )}
            {/* Additional photos can be displayed here */}
          </ScrollView>

          {/* Book details */}
          <View style={styles.bookDetails}>
            <View style={styles.row}>
              <Text style={styles.title}>{book.title}</Text>
              {book.transactionType === TransactionType.SALE && book.price &&
                <Text style={styles.price}>Preço: {book.price}€</Text>
              }
            </View>
            <Text style={styles.authorYear}>{book.year}, {book.author}</Text>

            {/* Scrollable Description */}
            <ScrollView style={styles.descriptionContainer}>
              <Text style={styles.description}>{book.description}</Text>
            </ScrollView>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {book.genre.map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
            </View>

            {/* IconAndTextButton (Add to cart) */}
            {!isToSell ? (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={onActionButton}
              >
                <Ionicons name="add" size={24} color="white" />
                <Text style={styles.addToCartText}>
                  {book.transactionType === TransactionType.SALE ? 'Adicionar ao carrinho' :
                    book.transactionType === TransactionType.RENTAL ? 'Alugar' :
                      'Trocar'
                  }
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={onActionButton}
              >
                <Text style={styles.addToCartText}>Selecionar livro</Text>
              </TouchableOpacity>
            )}

          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  bookImage: {
    width: 200,
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookDetails: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
  },
  authorYear: {
    fontSize: 14,
    marginBottom: 8,
  },
  descriptionContainer: {
    maxHeight: 200, 
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
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
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8C756A',
    padding: 10,
    borderRadius: 5,
  },
  addToCartText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailsDialog;
