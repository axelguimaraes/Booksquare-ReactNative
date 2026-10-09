import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import BookDetailsDialog from '../../Components/BookDetailsDialog';
import BookSummary from '../../Components/BookSummary';
import BarcodeScanner from '../../Components/BarcodeScanner';
import PhotoPicker from '../../Components/PhotoPicker';
import { addBook } from '../../Services/BooksService';
import { getBookInfoByISBN, populateBookFromJson } from '../../Services/BookLookupService';
import { getCurrentUser } from '../../Services/AuthService';
import { uploadMedia } from '../../Services/StorageService';
import { Book, TransactionType } from '../../Models/Book';
import { parsePrice, sanitizePriceInput } from '../../Utils/format';
import Button from '../../Components/ui/Button';
import TextField from '../../Components/ui/TextField';
import { Footer, KeyboardScreen } from '../../Components/ui/Layout';
import { colors, spacing, typography } from '../../Components/ui/theme';

const TRANSACTION_TYPES = [TransactionType.SALE, TransactionType.RENTAL, TransactionType.TRADE];
const ISBN_PATTERN = /^(?:\d{13}|\d{9}[\dXx])$/;

type FormErrors = { transactionType?: string, price?: string, photos?: string };

const AddBook = ({ navigation }) => {
  const [isbn, setIsbn] = useState('');
  const [isbnError, setIsbnError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  // Book found by the lookup, previewed in the details dialog before the user picks it.
  const [preview, setPreview] = useState<Book | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [publishing, setPublishing] = useState(false);

  const cleanIsbn = isbn.replace(/[\s-]/g, '');

  const resetValues = () => {
    setIsbn('');
    setPreview(null);
    setBook(null);
    setTransactionType(null);
    setPrice('');
    setPhotos([]);
    setErrors({});
  }

  const searchBook = async (value: string) => {
    const candidate = value.replace(/[\s-]/g, '');
    if (!ISBN_PATTERN.test(candidate)) {
      setIsbnError('Introduza um ISBN válido, com 10 ou 13 dígitos.');
      return;
    }

    setIsbnError(null);
    setSearching(true);
    try {
      const response = await getBookInfoByISBN(candidate);
      if (!response) {
        setIsbnError('Não encontrámos nenhum livro com este ISBN. Confirme os dígitos e tente novamente.');
        return;
      }
      setPreview(populateBookFromJson(response));
    } catch (error) {
      console.error('Error:', error);
      setIsbnError('Não foi possível pesquisar o livro de momento. Tente novamente dentro de alguns minutos.');
    } finally {
      setSearching(false);
    }
  }

  const handleBarCodeScanned = (data: string) => {
    setScannerVisible(false);
    setIsbn(data);
    searchBook(data);
  };

  const handleSelectButton = () => {
    setBook(preview);
    setPreview(null);
  }

  const handleDiscardBook = () => {
    if (photos.length === 0 && !price) {
      resetValues();
      return;
    }
    Alert.alert('Descartar livro?', 'As fotos e os dados introduzidos serão perdidos.', [
      { text: 'Continuar a editar', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: resetValues },
    ]);
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const parsedPrice = parsePrice(price);
    if (!transactionType) {
      newErrors.transactionType = 'Escolha se quer vender, alugar ou trocar o livro.';
    } else if (transactionType === TransactionType.SALE && !(parsedPrice > 0)) {
      newErrors.price = 'Introduza o preço de venda.';
    } else if (transactionType === TransactionType.RENTAL && !(parsedPrice > 0)) {
      newErrors.price = 'Introduza o preço por dia.';
    }
    if (photos.length === 0) {
      newErrors.photos = 'Adicione pelo menos uma foto do livro.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleConfirmButton = async () => {
    if (!book || !validate()) return;

    setPublishing(true);
    try {
      const downloadURLs = await uploadMedia(photos);
      const parsedPrice = parsePrice(price);

      const newBook: Book = {
        isbn: Number.parseInt(cleanIsbn),
        title: book.title,
        description: book.description ?? '',
        year: book.year,
        author: book.author,
        genre: book.genre,
        photos: [...book.photos, ...downloadURLs],
        transactionType: transactionType,
        price: transactionType === TransactionType.SALE ? parsedPrice : null,
        rentalPricePerDay: transactionType === TransactionType.RENTAL ? parsedPrice : null,
        currentOwner: getCurrentUser().displayName,
        isVisible: true,
      };

      const docId = await addBook(newBook);
      console.log('Book added with ID:', docId);
      resetValues();
      Alert.alert('Livro publicado', `"${newBook.title}" já está disponível para outros utilizadores.`);
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert(
        'Não foi possível publicar',
        error?.message?.includes('already exists')
          ? 'Já publicou um livro com este ISBN.'
          : 'Ocorreu um erro ao publicar o livro. Tente novamente.'
      );
    } finally {
      setPublishing(false);
    }
  }

  const renderSearchStep = () => (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.headerTitle} accessibilityRole="header">Adicionar livro</Text>
      <Text style={styles.headerExplanation}>
        Encontre o livro pelo código ISBN, que normalmente está junto ao código de barras na contracapa.
      </Text>

      <TextField
        label="ISBN"
        value={isbn}
        onChangeText={(text) => {
          setIsbn(text);
          setIsbnError(null);
        }}
        placeholder="Ex.: 9780451524935"
        keyboardType="number-pad"
        returnKeyType="search"
        onSubmitEditing={() => searchBook(isbn)}
        error={isbnError}
        maxLength={17}
      />
      <Button title="Procurar livro" icon="search" onPress={() => searchBook(isbn)} loading={searching} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button variant="secondary" title="Ler código de barras" icon="barcode-outline" onPress={() => setScannerVisible(true)} />
    </ScrollView>
  );

  const renderListingStep = () => (
    <>
      <ScrollView contentContainerStyle={[styles.content, styles.listingContent]} keyboardShouldPersistTaps="handled">
        <Text style={styles.headerTitle} accessibilityRole="header">Publicar livro</Text>
        <BookSummary book={{ ...book, isbn: Number.parseInt(cleanIsbn) || book.isbn }} />

        <Text style={styles.sectionTitle} accessibilityRole="header">Fotos do livro</Text>
        <Text style={styles.sectionHint}>Mostre o estado real do seu exemplar.</Text>
        <PhotoPicker
          photos={photos}
          onChange={(updated) => {
            setPhotos(updated);
            setErrors((current) => ({ ...current, photos: undefined }));
          }}
          error={errors.photos}
        />

        <Text style={styles.sectionTitle} accessibilityRole="header">Tipo de transação</Text>
        <SegmentedControl
          values={TRANSACTION_TYPES}
          selectedIndex={transactionType ? TRANSACTION_TYPES.indexOf(transactionType) : -1}
          onChange={(event) => {
            setTransactionType(TRANSACTION_TYPES[event.nativeEvent.selectedSegmentIndex]);
            setPrice('');
            setErrors((current) => ({ ...current, transactionType: undefined, price: undefined }));
          }}
          tintColor={colors.primary}
          fontStyle={{ color: colors.text, fontSize: 15 }}
          activeFontStyle={{ color: colors.onPrimary, fontSize: 15, fontWeight: 'bold' }}
          style={styles.segmentedControl}
          accessibilityLabel="Tipo de transação"
        />
        {errors.transactionType && <Text style={styles.errorText}>{errors.transactionType}</Text>}

        {(transactionType === TransactionType.SALE || transactionType === TransactionType.RENTAL) && (
          <View style={styles.priceInput}>
            <TextField
              label={transactionType === TransactionType.SALE ? 'Preço de venda' : 'Preço por dia'}
              value={price}
              onChangeText={(text) => {
                setPrice(sanitizePriceInput(text));
                setErrors((current) => ({ ...current, price: undefined }));
              }}
              placeholder="0,00"
              keyboardType="decimal-pad"
              error={errors.price}
              right={<Text style={styles.currency}>{transactionType === TransactionType.SALE ? '€' : '€/dia'}</Text>}
            />
          </View>
        )}
      </ScrollView>

      <Footer inset={false}>
        <Button variant="secondary" title="Descartar" icon="trash-outline" onPress={handleDiscardBook} style={styles.footerButton} disabled={publishing} />
        <Button title="Publicar" icon="checkmark" onPress={handleConfirmButton} loading={publishing} style={styles.footerButton} />
      </Footer>
    </>
  );

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <KeyboardScreen>
        {book ? renderListingStep() : renderSearchStep()}
      </KeyboardScreen>
      <BottomBar navigation={navigation} />

      <BarcodeScanner visible={scannerVisible} onScanned={handleBarCodeScanned} onClose={() => setScannerVisible(false)} />

      {preview && (
        <BookDetailsDialog
          visible
          onClose={() => setPreview(null)}
          book={preview}
          onActionButton={handleSelectButton}
          hasTransactionType={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  // Room below the price field, so it isn't flush against the footer while typing.
  listingContent: {
    paddingBottom: spacing.xxl * 2,
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  headerExplanation: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  segmentedControl: {
    minHeight: 40,
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  priceInput: {
    marginTop: spacing.lg,
  },
  currency: {
    ...typography.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});

export default AddBook;
