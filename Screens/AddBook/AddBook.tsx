import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Image as RNImage
} from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import { addBook, getBookInfoByISBN, populateBookFromJson } from '../../Services/BooksService';
import BookDetailsDialog from '../../Components/BookDetailsDialog';
import { Book, TransactionType } from '../../Models/Book';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../../config/firebase';
import BarcodeScanner from '../../Utils/useBarcodeScanner';
import { ImagePickerResult } from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';
import uploadMedia from '../../Utils/uploadMedia';

const AddBook = ({ navigation }) => {
  const [isbn, setIsbn] = useState('');
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [book, setBook] = useState(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(null);
  const [price, setPrice] = useState(null);
  const [transactionTypeIndex, setTransactionTypeIndex] = useState(null)
  const [rentalPricePerDay, setRentalPricePerDay] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isBarcodeScannerVisible, setIsBarcodeScannerVisible] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const resetValues = () => {
    setIsbn(null)
    setBookInfo(null)
    setBook(null)
    setPrice(null)
    setTransactionType(null)
    setTransactionTypeIndex(null)
    setRentalPricePerDay(null)
  }

  const handleISBNSubmit = () => {
    if (!isbn || isbn === '') {
      alert('Insira um ISBN válido!')
      return
    }

    const isbnRegex = /^(?:\d{13}|\d{9}[\dXx])$/;
    if (!isbnRegex.test(isbn)) {
      alert('Insira um ISBN válido!')
      return;
    }

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

  const handleBarcodeButton = () => {
    setIsBarcodeScannerVisible(true);
  };

  const handleBarCodeScanned = (data) => {
    setIsbn(data);
    setIsBarcodeScannerVisible(false);
  };

  const handleCloseScanner = () => {
    setIsBarcodeScannerVisible(false);
  };

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
    resetValues()
  }

  const handleConfirmButton = async () => {
    setLoading(true);

    if (!bookInfo) return;
    if (transactionType === null) {
      setLoading(false);
      alert("Selecione uma opção de transação!");
      return;
    }
    if (transactionType === TransactionType.SALE && price == null) {
      setLoading(false);
      alert("Insira o preço para venda!");
      return;
    }

    if (selectedImages.length < 1) {
      setLoading(false)
      alert("Adicione fotos do livro!");
      return
    }

    const downloadURLs = await uploadMedia(selectedImages);

    const newBook: Book = {
      isbn: Number.parseInt(isbn),
      title: bookInfo.title,
      description: bookInfo.description,
      year: bookInfo.year,
      author: bookInfo.author,
      genre: bookInfo.genre,
      photos: [...bookInfo.photos, ...downloadURLs, ],
      transactionType: transactionType,
      price: transactionType === TransactionType.SALE ? Number.parseFloat(price) : null,
      rentalPricePerDay: transactionType === TransactionType.RENTAL ? Number.parseFloat(rentalPricePerDay) : null,
      currentOwner: FIREBASE_AUTH.currentUser.displayName,
      isVisible: true,
    };

    addBook(newBook)
      .then((docId) => {
        console.log('Book added with ID:', docId);
        alert('Livro adicionado com sucesso!');
        resetValues();
        setLoading(false);
      })
      .catch(() => {
        alert('Este livro já existe na sua biblioteca.');
        setLoading(false);
      });

    resetValues()
  }

  const handlePriceChange = (text) => {
    // Remove non-numeric characters and leading zeros (excluding the dot for floats)
    let formattedText = text.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');

    // Limit to two digits after the decimal point
    const decimalIndex = formattedText.indexOf('.');
    if (decimalIndex !== -1 && formattedText.substring(decimalIndex + 1).length > 2) {
      formattedText = formattedText.slice(0, decimalIndex + 3);
    }

    // Update the price state with the formatted text
    setPrice(formattedText);
  };

  const handlePricePerDayChange = (text) => {
    // Remove non-numeric characters and leading zeros (excluding the dot for floats)
    let formattedText = text.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1');

    // Limit to two digits after the decimal point
    const decimalIndex = formattedText.indexOf('.');
    if (decimalIndex !== -1 && formattedText.substring(decimalIndex + 1).length > 2) {
      formattedText = formattedText.slice(0, decimalIndex + 3);
    }

    // Update the price state with the formatted text
    setRentalPricePerDay(formattedText);
  };

  const handlePhotosButton = async () => {
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const successResult = result as ImagePicker.ImagePickerSuccessResult;
      const selectedAssets = successResult.assets;
      if (selectedAssets.length > 0) {
        const selectedImages = selectedAssets.map(asset => asset.uri);
        setSelectedImages(selectedImages);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };


  return (
    <View style={styles.container}>
      {isBarcodeScannerVisible ? (
        <BarcodeScanner onBarCodeScanned={handleBarCodeScanned} onClose={handleCloseScanner} />
      ) : (
        <>
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

                <Text style={styles.title}>Insira fotos do livro:</Text>
                <View style={{paddingBottom: 10}}>
                  {selectedImages.length === 0 ? (
                    <TouchableOpacity style={styles.photosButton} onPress={handlePhotosButton}>
                      <Ionicons name='camera-outline' size={20} color="white"></Ionicons>
                      <Text style={styles.photosButtonText}>Carregar fotos</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.selectedImagesContainer}>
                      {selectedImages.map((imageUri, index) => (
                        <View key={index} style={styles.selectedImageContainer}>
                          <RNImage source={{ uri: imageUri }} style={styles.selectedImage} />
                          <TouchableOpacity onPress={() => handleRemoveImage(index)} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={24} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
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
                      value={price ? `€ ${price}` : ''}
                      onChangeText={handlePriceChange}
                      placeholder="Insira preço"
                      keyboardType='number-pad'
                    />
                  </View>
                )}

                {transactionType === TransactionType.RENTAL && (
                  <View style={styles.priceInput}>
                    <Text style={styles.title}>Preço por dia</Text>
                    <TextInput
                      style={styles.input}
                      value={rentalPricePerDay ? `€ ${rentalPricePerDay}` : ''}
                      onChangeText={handlePricePerDayChange}
                      placeholder="Insira preço diário de aluguer"
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
                <View style={styles.ISBNContainer}>
                  <TextInput
                    style={styles.input}
                    value={isbn}
                    onChangeText={setIsbn}
                    placeholder="Inserir ISBN"
                    keyboardType='number-pad'
                  />
                  <TouchableOpacity style={{ paddingLeft: 10 }} onPress={handleBarcodeButton} >
                    <Ionicons name="barcode-outline" size={35} color="black" />
                  </TouchableOpacity>
                </View>
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
              hasTransactionType={false}
            />
          )}
          <BottomBar navigation={navigation} />
        </>
      )
      }
    </View >
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
    width: '100%'
  },
  confirmButton: {
    backgroundColor: '#8C756A',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
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
  ISBNContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingRight: 40,
  },
  photosButton: {
    backgroundColor: '#8C756A',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  photosButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedImageContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 5,
  },
});

export default AddBook;
