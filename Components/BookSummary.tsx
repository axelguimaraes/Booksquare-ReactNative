import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Book } from '../Models/Book';
import { getPriceLabel } from '../Utils/bookLabels';
import BookCover from './BookCover';
import { colors, radius, spacing, typography } from './ui/theme';

interface Props {
  book: Book;
  // Hides genres and ISBN, e.g. for the banner above a chat.
  compact?: boolean;
}

// Read-only overview of a book, used at the top of the add, rent, trade and chat screens.
const BookSummary: React.FC<Props> = ({ book, compact = false }) => {
  const price = getPriceLabel(book);
  return (
    <View style={styles.container} accessible accessibilityLabel={`${book.title}, ${book.author}, ${book.year}. ${price}`}>
      <BookCover uri={book.photos?.[0]} width={compact ? 48 : 80} height={compact ? 72 : 120} />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.secondary} numberOfLines={1}>{book.author} · {book.year}</Text>
        {!!price && <Text style={styles.price}>{price}</Text>}
        {!compact && (
          <>
            {book.genre?.length > 0 && (
              <View style={styles.tags}>
                {book.genre.map((tag) => (
                  <Text key={tag} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}
            <Text style={styles.isbn}>ISBN {book.isbn}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
  },
  secondary: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  tag: {
    ...typography.small,
    backgroundColor: colors.tag,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  isbn: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default BookSummary;
