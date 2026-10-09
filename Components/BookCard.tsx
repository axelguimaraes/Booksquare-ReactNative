import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import BookDetailsDialog from './BookDetailsDialog';
import BookCover from './BookCover';
import { Book } from '../Models/Book';
import { getPriceLabel } from '../Utils/bookLabels';
import { colors, radius, spacing, typography } from './ui/theme';

interface Props {
  book: Book;
  onActionButton: () => Promise<void> | void
}

const BookCard: React.FC<Props> = ({ book, onActionButton }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const price = getPriceLabel(book);

  const handleActionButton = () => {
    setDialogVisible(false);
    onActionButton();
  }

  return (
    <>
      <Pressable
        onPress={() => setDialogVisible(true)}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${book.title}, ${book.author}, ${book.year}. ${price}${book.currentOwner ? `. Publicado por ${book.currentOwner}` : ''}`}
        accessibilityHint="Abre os detalhes do livro"
      >
        <BookCover uri={book.photos[0]} width={100} height={150} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.authorYear} numberOfLines={1}>{book.author}, {book.year}</Text>
          <View style={styles.tagsContainer}>
            {book.genre.map((tag) => (
              <Text key={tag} style={styles.tag}>{tag}</Text>
            ))}
          </View>
          {book.currentOwner && (
            <Text style={styles.currentOwner} numberOfLines={1}>Publicado por {book.currentOwner}</Text>
          )}
          {!!price && <Text style={styles.price}>{price}</Text>}
        </View>
      </Pressable>
      <BookDetailsDialog
        book={book}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        onActionButton={handleActionButton}
        hasTransactionType={book.transactionType != null}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  authorYear: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  tag: {
    ...typography.small,
    backgroundColor: colors.tag,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  currentOwner: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default BookCard;
