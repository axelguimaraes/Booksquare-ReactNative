import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { tradeBook } from '../../Services/BooksService';
import { getCurrentUser } from '../../Services/AuthService';
import { uploadMedia } from '../../Services/StorageService';
import { getUserIdByDisplayName } from '../../Services/UsersService';
import { createTransaction } from '../../Services/TransactionsService';
import { Transaction } from '../../Models/Transaction';
import { Book } from '../../Models/Book';
import uuid from 'react-native-uuid'
import BarcodeScanner from '../../Components/BarcodeScanner';
import BookSummary from '../../Components/BookSummary';
import PhotoPicker from '../../Components/PhotoPicker';
import Button from '../../Components/ui/Button';
import IconButton from '../../Components/ui/IconButton';
import ScreenHeader from '../../Components/ui/ScreenHeader';
import TextField from '../../Components/ui/TextField';
import { Footer, KeyboardScreen } from '../../Components/ui/Layout';
import { colors, spacing, typography } from '../../Components/ui/theme';

const ISBN_PATTERN = /^(?:\d{13}|\d{9}[\dXx])$/;

const tradeErrorMessage = (error: any) =>
    error?.message === 'Book is already traded' || error?.message === 'Book not found'
        ? 'Este livro já não está disponível para troca.'
        : 'Ocorreu um erro ao propor a troca. Tente novamente.';

const TradeForm = ({ route, navigation }) => {
    const { book }: { book: Book } = route.params
    const [loading, setLoading] = useState(false);
    const [bookToTradeISBN, setBookToTradeISBN] = useState('')
    const [isBarcodeScannerVisible, setIsBarcodeScannerVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ isbn?: string, photos?: string }>({});

    const validate = (): boolean => {
        const newErrors: { isbn?: string, photos?: string } = {};
        if (!ISBN_PATTERN.test(bookToTradeISBN.replace(/[\s-]/g, ''))) {
            newErrors.isbn = 'Introduza um ISBN válido, com 10 ou 13 dígitos.';
        }
        if (selectedImages.length === 0) {
            newErrors.photos = 'Adicione pelo menos uma foto do livro que oferece.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleConfirmButton = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const downloadURLs = await uploadMedia(selectedImages);

            await tradeBook({
                bookId: book.id,
                userId: getCurrentUser().uid,
                isbn: Number.parseInt(bookToTradeISBN.replace(/[\s-]/g, '')),
                tradedByPhotos: downloadURLs
            });
            const transaction: Transaction = {
                id: uuid.v4().toString(),
                timestamp: Date.now(),
                book: book,
                idSender: await getUserIdByDisplayName(book.currentOwner),
                idReceiver: getCurrentUser().uid,
                transactionType: book.transactionType
            }
            await createTransaction(transaction).catch((error) => console.error('Error creating transaction', error))
            Alert.alert('Troca concluída', `Trocou um livro seu por "${book.title}".`);
            navigation.goBack()
        } catch (error) {
            console.error('Error trading book:', error);
            Alert.alert('Não foi possível trocar', tradeErrorMessage(error));
            setLoading(false);
        }
    };

    const handleBarCodeScanned = (data: string) => {
        setBookToTradeISBN(data);
        setErrors((current) => ({ ...current, isbn: undefined }));
        setIsBarcodeScannerVisible(false);
    };

    return (
        <KeyboardScreen>
            <ScreenHeader title="Trocar livro" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Text style={styles.sectionTitle} accessibilityRole="header">Livro que pretende</Text>
                <BookSummary book={book} />

                <Text style={styles.sectionTitle} accessibilityRole="header">Livro que oferece em troca</Text>
                <TextField
                    label="ISBN do seu livro"
                    value={bookToTradeISBN}
                    onChangeText={(text) => {
                        setBookToTradeISBN(text);
                        setErrors((current) => ({ ...current, isbn: undefined }));
                    }}
                    placeholder="Ex.: 9780451524935"
                    keyboardType="number-pad"
                    maxLength={17}
                    error={errors.isbn}
                    right={
                        <IconButton
                            icon="barcode-outline"
                            color={colors.primary}
                            accessibilityLabel="Ler código de barras"
                            onPress={() => setIsBarcodeScannerVisible(true)}
                        />
                    }
                />

                <Text style={styles.label}>Fotos do seu livro</Text>
                <PhotoPicker
                    photos={selectedImages}
                    onChange={(photos) => {
                        setSelectedImages(photos);
                        setErrors((current) => ({ ...current, photos: undefined }));
                    }}
                    error={errors.photos}
                />
            </ScrollView>
            <Footer>
                <Button variant="secondary" title="Cancelar" onPress={() => navigation.goBack()} style={styles.footerButton} disabled={loading} />
                <Button title="Confirmar troca" onPress={handleConfirmButton} loading={loading} style={styles.footerButton} />
            </Footer>

            <BarcodeScanner
                visible={isBarcodeScannerVisible}
                onScanned={handleBarCodeScanned}
                onClose={() => setIsBarcodeScannerVisible(false)}
            />
        </KeyboardScreen>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.heading,
        color: colors.text,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    label: {
        ...typography.label,
        color: colors.text,
        marginTop: spacing.xs,
        marginBottom: spacing.sm,
    },
    footerButton: {
        flex: 1,
    },
});

export default TradeForm;
