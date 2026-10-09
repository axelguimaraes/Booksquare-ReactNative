import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigationParamsList } from '../../Navigation/UserStack';
import { getUserById } from '../../Services/UsersService';
import { getAllBooks } from '../../Services/BooksService';
import { getCurrentUser } from '../../Services/AuthService';
import { User } from '../../Models/User';
import { Book } from '../../Models/Book';
import { requireAccount } from '../../Utils/requireAccount';
import { useBookAction } from '../../Utils/useBookAction';
import BookCard from '../../Components/BookCard';
import Avatar from '../../Components/ui/Avatar';
import Button from '../../Components/ui/Button';
import ScreenHeader from '../../Components/ui/ScreenHeader';
import { EmptyState, LoadingView } from '../../Components/ui/StateViews';
import { colors, radius, spacing, typography } from '../../Components/ui/theme';

type ProfileOtherUsersNavigationProp = StackNavigationProp<StackNavigationParamsList, 'ProfileOtherUsers'>;
type ProfileOtherUsersRouteProp = RouteProp<StackNavigationParamsList, 'ProfileOtherUsers'>;

type Props = {
  navigation: ProfileOtherUsersNavigationProp;
  route: ProfileOtherUsersRouteProp;
};

const ProfileOtherUsers: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;

  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[] | null>(null);
  const handleAction = useBookAction();
  const isSelf = userId === getCurrentUser()?.uid;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getUserById(userId)
      .then(async (userData) => {
        setUser(userData)
        setLoading(false);
        if (userData) {
          // Listings are linked to their owner by display name.
          const allBooks = await getAllBooks();
          setBooks(allBooks.filter((book) => book.currentOwner === userData.displayName));
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [userId]);

  const handleMessageButton = () => {
    if (!requireAccount()) return
    navigation.navigate('ChatScreen', { currentUser: getCurrentUser().uid, otherUser: user.userId, book: null });
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingView label="A carregar perfil" />;
    }
    if (!user) {
      return <EmptyState icon="person-outline" title="Utilizador não encontrado" message="Este perfil já não está disponível." />;
    }

    const header = (
      <>
        <View style={styles.profileContainer}>
          <Avatar uri={user.profilePhoto} size={88} />
          <View style={styles.profileInfo}>
            <Text style={styles.name} accessibilityRole="header">{user.displayName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
        {!isSelf && (
          <Button title="Enviar mensagem" icon="chatbox-ellipses-outline" onPress={handleMessageButton} style={styles.messageButton} />
        )}
        <Text style={styles.sectionTitle} accessibilityRole="header">Livros publicados</Text>
      </>
    );

    return (
      <FlatList
        data={books ?? []}
        renderItem={({ item }) => <BookCard book={item} onActionButton={() => handleAction(item)} />}
        keyExtractor={(item) => item.id ?? String(item.isbn)}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
        ListHeaderComponent={header}
        ListEmptyComponent={
          books === null ? (
            <ActivityIndicator color={colors.primary} style={styles.listMessage} accessibilityLabel="A carregar livros" />
          ) : (
            <Text style={styles.listMessage}>{user.displayName} não tem livros disponíveis de momento.</Text>
          )
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Perfil" onBack={() => navigation.goBack()} />
      {renderContent()}
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  name: {
    ...typography.heading,
    color: colors.text,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messageButton: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  listMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});

export default ProfileOtherUsers;
