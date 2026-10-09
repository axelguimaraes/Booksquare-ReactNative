import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import BookCard from '../../Components/BookCard';
import { subscribeToBooks } from '../../Services/BooksService';
import { Book, TransactionType } from '../../Models/Book';
import { useBookAction } from '../../Utils/useBookAction';
import { EmptyState, LoadingView } from '../../Components/ui/StateViews';
import { spacing } from '../../Components/ui/theme';

interface Props {
  transactionType: TransactionType;
  emptyMessage: string;
}

// One home tab: the visible listings of a transaction type, kept up to date in real time.
const BookListScreen: React.FC<Props> = ({ transactionType, emptyMessage }) => {
  const [books, setBooks] = useState<Book[] | null>(null);
  const handleAction = useBookAction();

  useEffect(() => {
    // Delivers the current listings first, then every change.
    const unsubscribe = subscribeToBooks(transactionType, setBooks);
    return unsubscribe;
  }, [transactionType]);

  if (books === null) {
    return <LoadingView label="A carregar livros" />;
  }

  if (books.length === 0) {
    return <EmptyState icon="library-outline" title={emptyMessage} message="Volte mais tarde ou publique um livro seu." />;
  }

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookCard book={item} onActionButton={() => handleAction(item)} />}
      keyExtractor={(item) => item.id ?? String(item.isbn)}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
  },
});

export default BookListScreen;
