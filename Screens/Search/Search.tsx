import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BookCard from '../../Components/BookCard';
import { getAllBooks } from '../../Services/BooksService';
import { Book } from '../../Models/Book';
import { normalizeText } from '../../Utils/format';
import { useBookAction } from '../../Utils/useBookAction';
import IconButton from '../../Components/ui/IconButton';
import { EmptyState, LoadingView } from '../../Components/ui/StateViews';
import { colors, radius, spacing } from '../../Components/ui/theme';

const matches = (book: Book, terms: string[]) => {
  const haystack = normalizeText([book.title, book.author, String(book.isbn), ...(book.genre ?? [])].join(' '));
  return terms.every((term) => haystack.includes(term));
};

// Searches every visible listing (buy, rent and trade) by title, author, genre or ISBN.
const Search = ({ navigation }) => {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const handleAction = useBookAction();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getAllBooks()
      .then(setBooks)
      .catch((e) => {
        console.error('Error fetching books:', e);
        setError(true);
      });
  }, []);

  const terms = useMemo(() => normalizeText(query).split(/\s+/).filter(Boolean), [query]);
  const results = useMemo(() => (books && terms.length > 0 ? books.filter((book) => matches(book, terms)) : []), [books, terms]);

  const renderContent = () => {
    if (error) {
      return <EmptyState icon="cloud-offline-outline" title="Não foi possível carregar os livros" message="Verifique a ligação e tente novamente." />;
    }
    if (books === null) {
      return <LoadingView label="A carregar livros" />;
    }
    if (terms.length === 0) {
      return <EmptyState icon="search-outline" title="Pesquisar livros" message="Pesquise por título, autor, género ou ISBN." />;
    }
    if (results.length === 0) {
      return <EmptyState icon="sad-outline" title="Nenhum resultado" message={`Não encontrámos livros para "${query.trim()}".`} />;
    }
    return (
      <FlatList
        data={results}
        renderItem={({ item }) => <BookCard book={item} onActionButton={() => handleAction(item)} />}
        keyExtractor={(item) => item.id ?? String(item.isbn)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <IconButton
          icon={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          color={colors.onPrimary}
          size={26}
          accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.inputWrapper}>
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Título, autor, género ou ISBN"
            placeholderTextColor={colors.placeholder}
            accessibilityLabel="Pesquisar livros"
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {Platform.OS === 'android' && query.length > 0 && (
            <IconButton icon="close-circle" size={20} color={colors.textSecondary} accessibilityLabel="Limpar pesquisa" onPress={() => setQuery('')} />
          )}
        </View>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingRight: spacing.md,
    paddingLeft: spacing.xs,
    backgroundColor: colors.primary,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingLeft: spacing.sm,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: spacing.sm,
  },
  list: {
    padding: spacing.lg,
  },
});

export default Search;
