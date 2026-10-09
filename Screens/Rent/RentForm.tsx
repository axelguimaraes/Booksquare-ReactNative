import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { rentBook } from '../../Services/BooksService';
import { getCurrentUser } from '../../Services/AuthService';
import { createTransaction } from '../../Services/TransactionsService';
import { getUserIdByDisplayName } from '../../Services/UsersService';
import { Transaction } from '../../Models/Transaction';
import { Book } from '../../Models/Book';
import { formatDate, formatPrice } from '../../Utils/format';
import uuid from 'react-native-uuid'
import BookSummary from '../../Components/BookSummary';
import Button from '../../Components/ui/Button';
import ScreenHeader from '../../Components/ui/ScreenHeader';
import { Footer } from '../../Components/ui/Layout';
import { colors, radius, spacing, typography } from '../../Components/ui/theme';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(startOfDay(date).getTime() + days * DAY_MS);

const rentErrorMessage = (error: any) => {
    switch (error?.message) {
        case 'Book is already rented':
            return 'Este livro acabou de ser alugado por outra pessoa.';
        case 'Book is already traded':
            return 'Este livro já não está disponível.';
        case 'Book not found':
            return 'Este livro já não está disponível.';
        default:
            return 'Ocorreu um erro ao alugar o livro. Tente novamente.';
    }
};

const RentForm = ({ route, navigation }) => {
    const { book }: { book: Book } = route.params
    const today = startOfDay(new Date());
    const minimumDate = addDays(today, 1);
    const [selectedDate, setSelectedDate] = useState(() => addDays(today, 7));
    const [loading, setLoading] = useState(false);

    const days = Math.max(1, Math.round((startOfDay(selectedDate).getTime() - today.getTime()) / DAY_MS));
    const total = book.rentalPricePerDay != null ? days * book.rentalPricePerDay : null;

    const openAndroidDatePicker = () => {
        DateTimePickerAndroid.open({
            value: selectedDate,
            mode: 'date',
            minimumDate,
            onValueChange: (_event, date) => setSelectedDate(date),
        });
    };

    const handleConfirmButton = async () => {
        setLoading(true);
        try {
            await rentBook({
                bookId: book.id,
                userId: getCurrentUser().uid,
                date: selectedDate
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
            Alert.alert('Livro alugado', `Alugou "${book.title}" até ${formatDate(selectedDate)}.`);
            navigation.goBack()
        } catch (error) {
            console.error('Error renting book:', error);
            Alert.alert('Não foi possível alugar', rentErrorMessage(error));
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader title="Alugar livro" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.content}>
                <BookSummary book={book} />

                <Text style={styles.sectionTitle} accessibilityRole="header">Data de devolução</Text>
                {Platform.OS === 'ios' ? (
                    <View style={styles.dateRow}>
                        <Text style={styles.dateLabel}>Alugar até</Text>
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="compact"
                            minimumDate={minimumDate}
                            locale="pt-PT"
                            accentColor={colors.primary}
                            themeVariant="light"
                            onValueChange={(_event, date) => setSelectedDate(date)}
                            accessibilityLabel="Data de devolução"
                        />
                    </View>
                ) : (
                    <Pressable
                        style={({ pressed }) => [styles.dateField, pressed && styles.pressed]}
                        onPress={openAndroidDatePicker}
                        accessibilityRole="button"
                        accessibilityLabel={`Data de devolução, ${formatDate(selectedDate)}`}
                        accessibilityHint="Abre o calendário"
                    >
                        <Ionicons name="calendar-outline" size={22} color={colors.primary} />
                        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                    </Pressable>
                )}

                <View style={styles.summary} accessible accessibilityLabel={`${days} ${days === 1 ? 'dia' : 'dias'}${total != null ? `, total ${formatPrice(total)}` : ''}`}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Duração</Text>
                        <Text style={styles.summaryValue}>{days} {days === 1 ? 'dia' : 'dias'}</Text>
                    </View>
                    {book.rentalPricePerDay != null && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Preço por dia</Text>
                            <Text style={styles.summaryValue}>{formatPrice(book.rentalPricePerDay)}</Text>
                        </View>
                    )}
                    {total != null && (
                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <Footer>
                <Button variant="secondary" title="Cancelar" onPress={() => navigation.goBack()} style={styles.footerButton} disabled={loading} />
                <Button title="Confirmar aluguer" onPress={handleConfirmButton} loading={loading} style={styles.footerButton} />
            </Footer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.heading,
        color: colors.text,
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 48,
    },
    dateLabel: {
        ...typography.body,
        color: colors.text,
    },
    dateField: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: radius.sm,
    },
    pressed: {
        backgroundColor: colors.surface,
    },
    dateText: {
        ...typography.body,
        flex: 1,
        color: colors.text,
        marginLeft: spacing.sm,
    },
    summary: {
        marginTop: spacing.xl,
        padding: spacing.lg,
        borderRadius: radius.sm,
        backgroundColor: colors.surface,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
    },
    summaryLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    summaryValue: {
        ...typography.body,
        color: colors.text,
    },
    totalRow: {
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
    totalLabel: {
        ...typography.heading,
        color: colors.text,
    },
    totalValue: {
        ...typography.heading,
        color: colors.text,
    },
    footerButton: {
        flex: 1,
    },
});

export default RentForm;
