import React, { useState } from 'react';
import { View, Text, Modal, Image, StyleSheet, ScrollView, ImageResizeMode, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Book } from '../Models/Book';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationParamsList } from '../Navigation/UserStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUserByDisplayName, getUserIdByDisplayName } from '../Services/UsersService';
import { getCurrentUser } from '../Services/AuthService';
import { getActionIcon, getActionLabel, getPriceLabel } from '../Utils/bookLabels';
import { requireAccount } from '../Utils/requireAccount';
import BookCover from './BookCover';
import Button from './ui/Button';
import IconButton from './ui/IconButton';
import ScreenHeader from './ui/ScreenHeader';
import { Footer } from './ui/Layout';
import { colors, radius, spacing, typography } from './ui/theme';

interface Props {
  book: Book;
  visible: boolean;
  onClose: () => void;
  onActionButton: () => void;
  // false when previewing a book that is not listed yet (add book flow): shows "Selecionar livro".
  hasTransactionType: boolean
}

const PHOTO_HEIGHT = 300;

const BookDetailsDialog: React.FC<Props> = ({ book, visible, onClose, onActionButton, hasTransactionType }) => {
  const navigation = useNavigation<StackNavigationProp<StackNavigationParamsList>>()
  const [sizeMode, setSizeMode] = useState<ImageResizeMode>("contain");
  const [contacting, setContacting] = useState(false);
  const [photoWidth, setPhotoWidth] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  const isOwnBook = !!book.currentOwner && book.currentOwner === getCurrentUser()?.displayName;
  const price = getPriceLabel(book);

  // The owner is looked up only when needed, not for every card in a list.
  const handleOwnerClick = async () => {
    if (isOwnBook) {
      onClose()
      navigation.navigate('Profile');
      return
    }
    const userId = await getUserIdByDisplayName(book.currentOwner).catch(() => null)
    if (!userId) {
      Alert.alert('Perfil indisponível', 'Não foi possível abrir o perfil de quem publicou este livro.');
      return
    }
    onClose()
    navigation.navigate('ProfileOtherUsers', { userId });
  }

  const handleExpandImage = () => {
    setSizeMode((mode) => (mode === 'contain' ? 'cover' : 'contain'));
  };

  const onContactButton = async () => {
    if (!requireAccount()) return
    setContacting(true);
    try {
      const owner = await getUserByDisplayName(book.currentOwner);
      if (owner) {
        onClose()
        navigation.navigate('ChatScreen', { currentUser: getCurrentUser().uid, otherUser: owner.userId, book: book });
      } else {
        Alert.alert('Utilizador não encontrado', 'Não foi possível contactar quem publicou este livro.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Erro', 'Não foi possível contactar quem publicou este livro. Tente novamente.');
    } finally {
      setContacting(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.container}>
          <ScreenHeader title="Detalhes do livro" onBack={onClose} backIcon="close" backLabel="Fechar" />

          <ScrollView contentContainerStyle={styles.content}>
            {/* Photos */}
            {book.photos.length > 0 ? (
              <View onLayout={(e) => setPhotoWidth(e.nativeEvent.layout.width)}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / photoWidth))}
                  accessibilityLabel={`Fotos do livro, ${book.photos.length}`}
                >
                  {book.photos.map((imageUrl, index) => (
                    <View key={index} style={{ width: photoWidth, height: PHOTO_HEIGHT }}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.bookImage}
                        resizeMode={sizeMode}
                        accessibilityLabel={`Foto ${index + 1} de ${book.photos.length}`}
                      />
                    </View>
                  ))}
                </ScrollView>
                <IconButton
                  icon={sizeMode === 'contain' ? 'expand' : 'contract'}
                  color={colors.onPrimary}
                  onPress={handleExpandImage}
                  accessibilityLabel={sizeMode === 'contain' ? 'Ampliar foto' : 'Mostrar foto completa'}
                  style={styles.expandIcon}
                />
                {book.photos.length > 1 && (
                  <View style={styles.pagination} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                    {book.photos.map((_, index) => (
                      <View key={index} style={[styles.dot, index === photoIndex && styles.activeDot]} />
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <BookCover width={200} height={PHOTO_HEIGHT} style={styles.placeholderCover} />
            )}

            {/* Book details */}
            <View style={styles.row}>
              <Text style={styles.title} accessibilityRole="header">{book.title}</Text>
              {!!price && <Text style={styles.price}>{price}</Text>}
            </View>
            <Text style={styles.authorYear}>{book.author} · {book.year}</Text>

            {book.genre.length > 0 && (
              <View style={styles.tagsContainer}>
                {book.genre.map((tag) => (
                  <Text key={tag} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}

            {!!book.description && (
              <>
                <Text style={styles.sectionTitle} accessibilityRole="header">Descrição</Text>
                <Text style={styles.description}>{book.description}</Text>
              </>
            )}

            {book.currentOwner && (
              <Pressable
                style={({ pressed }) => [styles.ownerRow, pressed && styles.pressed]}
                onPress={handleOwnerClick}
                accessibilityRole="button"
                accessibilityLabel={`Publicado por ${book.currentOwner}`}
                accessibilityHint="Abre o perfil"
              >
                <Ionicons name="person-circle-outline" size={24} color={colors.textSecondary} />
                <Text style={styles.ownerText}>Publicado por <Text style={styles.ownerName}>{book.currentOwner}</Text></Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </ScrollView>

          {isOwnBook ? (
            <Footer>
              <Text style={styles.ownBookText}>Este livro foi publicado por si.</Text>
            </Footer>
          ) : hasTransactionType ? (
            // Stacked, main action first: side by side, the longer labels wrap on narrow phones.
            <Footer style={styles.stackedFooter}>
              <Button
                title={getActionLabel(book.transactionType)}
                icon={getActionIcon(book.transactionType)}
                onPress={onActionButton}
              />
              <Button
                variant="secondary"
                title="Contactar quem publicou"
                icon="chatbox-ellipses-outline"
                onPress={onContactButton}
                loading={contacting}
              />
            </Footer>
          ) : (
            <Footer>
              <Button title="Selecionar livro" icon="checkmark" onPress={onActionButton} style={styles.footerButton} />
            </Footer>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  placeholderCover: {
    alignSelf: 'center',
  },
  expandIcon: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: radius.pill,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
    backgroundColor: colors.tag,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
  },
  title: {
    ...typography.title,
    flex: 1,
    color: colors.text,
    marginRight: spacing.md,
  },
  price: {
    ...typography.heading,
    color: colors.text,
  },
  authorYear: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  tag: {
    ...typography.caption,
    backgroundColor: colors.tag,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  ownerText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  ownerName: {
    fontWeight: 'bold',
    color: colors.text,
  },
  ownBookText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
  stackedFooter: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
});

export default BookDetailsDialog;
