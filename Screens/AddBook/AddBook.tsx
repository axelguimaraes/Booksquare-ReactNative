import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import { addBook, getBookInfoByISBN, populateBookFromJson } from '../../Services/BooksService';
import BookDetailsDialog from '../../Components/BookDetailsDialog';
import { Book, TransactionType } from '../../Models/Book';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../../config/firebase';

const AddBook = ({ navigation }) => {
  const [isbn, setIsbn] = useState('');
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [book, setBook] = useState(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(null);
  const [price, setPrice] = useState(null);
  const [transactionTypeIndex, setTransactionTypeIndex] = useState(null)
  const [loading, setLoading] = useState(false)

  const resetValues = () => {
    setIsbn(null)
    setBookInfo(null)
    setBook(null)
    setPrice(null)
    setTransactionType(null)
    setTransactionTypeIndex(null)
  }

  const handleISBNSubmit = () => {
    if (!isbn || isbn === '') return;
    setLoading(true)
    getBookInfoByISBN(isbn)
      .then(response => {
        const newBook = populateBookFromJson(response);
        setBookInfo(newBook);
        setShowBookDialog(true);
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error)
      });
  }

  const handleCloseBookDialog = () => {
    setBookInfo(null)
    setShowBookDialog(false);
  };

  const handleSelectButton = () => {
    setBook(bookInfo)
    setShowBookDialog(false)
  }

  const handleSegmentedControlChange = (event) => {
    const selectedIndex = event.nativeEvent.selectedSegmentIndex;
    let selectedTransactionType;

    switch (selectedIndex) {
      case 0:
        selectedTransactionType = TransactionType.SALE;
        break;
      case 1:
        selectedTransactionType = TransactionType.RENTAL;
        break;
      case 2:
        selectedTransactionType = TransactionType.TRADE;
        break;
    }

    setTransactionType(selectedTransactionType);
  }


  const handleDiscardBook = () => {
    setBook(null)
    setPrice(null)
    setIsbn(null)
    setTransactionType(null)
    setTransactionTypeIndex(null)
  }

  const handleConfirmButton = () => {
    if (!bookInfo) return;
    if (transactionType === null) {
      alert("Selecione uma opção de transação!")
      return
    }
    if (transactionType === TransactionType.SALE && price == null) {
      alert("Insira o preço para venda!")
      return
    }

    setLoading(true)
    const newBook: Book = {
      isbn: Number.parseInt(isbn),
      title: bookInfo.title,
      description: bookInfo.description,
      year: bookInfo.year,
      author: bookInfo.author,
      genre: bookInfo.genre,
      transactionType: transactionType,
      price: transactionType === TransactionType.SALE ? Number.parseInt(price) : null,
      currentOwner: FIREBASE_AUTH.currentUser.displayName
    };

    addBook(newBook)
      .then((docId) => {
        console.log('Book added with ID:', docId);
        alert('Livro adicionado com sucesso!')
        resetValues()
      })
      .catch(() => {
        alert('Este livro já existe na sua biblioteca.');
      });

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      {/* Conditional rendering based on book state */}
      {book ? (
        <ScrollView contentContainerStyle={styles.bookDetailsContainer}>
          <View style={styles.bookDetails}>
            <Text style={styles.headerTitle}>Adicionar Livro</Text>

            <Text style={styles.title}>ISBN</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueBoxContent}>{isbn}</Text>
            </View>

            <Text style={styles.title}>Título</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueBoxContent}>{book.title}</Text>
            </View>

            <Text style={styles.title}>Ano</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueBoxContent}>{book.year}</Text>
            </View>

            <Text style={styles.title}>Autor(es)</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueBoxContent}>{book.author}</Text>
            </View>

            <Text style={styles.title}>Categorias</Text>
            <View style={styles.valueBox}>
              <Text style={styles.valueBoxContent}>{book.genre.join(', ')}</Text>
            </View>

            <Text style={styles.title}>Selecione o tipo de transação</Text>
            <SegmentedControl
              values={[TransactionType.SALE, TransactionType.RENTAL, TransactionType.TRADE]}
              selectedIndex={transactionTypeIndex}
              onChange={(event) => {
                setTransactionTypeIndex(event.nativeEvent.selectedSegmentIndex);
                handleSegmentedControlChange(event)
              }}
            />
            {transactionType === TransactionType.SALE && (
              <View style={styles.priceInput}>
                <Text style={styles.title}>Preço</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Insira preço"
                  keyboardType='number-pad'
                />
              </View>
            )}
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.discardButton} onPress={handleDiscardBook}>
                <Ionicons name="trash-outline" size={19} color="black" />
                <Text style={styles.discardButtonText}>Descartar Livro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBookButton} onPress={handleConfirmButton}>
                {loading ? <ActivityIndicator size="small" color="white" />
                  :
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                }
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputContainer}>
            <Text style={styles.headerTitle}>Adicionar Livro</Text>
            <Text style={styles.headerExplanation}>Adicione um livro facilmente usando o código ISBN
              encontrado na capa do livro. Os códigos ISBN geralmente encontram-se junto ao código de barras.</Text>

            <Text style={styles.title}>ISBN</Text>
            <TextInput
              style={styles.input}
              value={isbn}
              onChangeText={setIsbn}
              placeholder="Inserir ISBN"
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleISBNSubmit}>
              {loading ? <ActivityIndicator size="small" color="white" />
                :
                <Text style={styles.confirmButtonText}>Submeter</Text>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Book details dialog */}
      {bookInfo && (
        <BookDetailsDialog
          visible={showBookDialog}
          onClose={handleCloseBookDialog}
          book={bookInfo}
          onActionButton={handleSelectButton}
          isToSell={true}
        />
      )}
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  headerExplanation: {
    fontSize: 14,
    color: '#666',
    paddingBottom: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 20
  },
  valueBox: {
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 10,
    borderColor: '#ccc',
  },
  valueBoxContent: {
    marginLeft: 10,
    lineHeight: 30,
  },
  priceInput: {
    marginTop: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#8C756A',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookDetailsContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  bookDetails: {
    padding: 20
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  discardButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  confirmBookButton: {
    backgroundColor: '#8C756A',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default AddBook;
