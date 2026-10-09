import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import getTimestampText from '../../Utils/getTimestampText';
import { User } from '../../Models/User';
import { Chat, SingleMessage } from '../../Models/Chat';
import { markAllMessagesAsRead, sendSingleMessage, subscribeToChat } from '../../Services/ChatService';
import { getUserById } from '../../Services/UsersService';
import uuid from 'react-native-uuid';
import BookSummary from '../../Components/BookSummary';
import Avatar from '../../Components/ui/Avatar';
import IconButton from '../../Components/ui/IconButton';
import ScreenHeader from '../../Components/ui/ScreenHeader';
import { EmptyState, LoadingView } from '../../Components/ui/StateViews';
import { Footer, KeyboardScreen } from '../../Components/ui/Layout';
import { colors, radius, spacing, typography } from '../../Components/ui/theme';

const ChatScreen = ({ route, navigation }) => {
  const { currentUser, otherUser, book } = route.params;

  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [loadingChat, setLoadingChat] = useState(true);
  const [otherProfile, setOtherProfile] = useState<User | null>(null)
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getUserById(otherUser)
      .then(setOtherProfile)
      .catch((error) => console.error('Error fetching user:', error));
  }, [otherUser]);

  useEffect(() => {
    // Delivers the chat (creating it on first contact) and then every new message.
    const unsubscribe = subscribeToChat(currentUser, otherUser, (updatedChat: Chat | null) => {
      setCurrentChat(updatedChat);
      setLoadingChat(false);
    });
    return unsubscribe;
  }, [currentUser, otherUser]);

  useEffect(() => {
    const hasUnread = currentChat?.messageThread.some((message) => message.receiverID === currentUser && !message.isRead);
    if (hasUnread) {
      markAllMessagesAsRead(currentChat.id, currentUser)
        .catch(error => console.error('Error marking messages as read:', error));
    }
  }, [currentChat])

  const sendMessage = async () => {
    const content = inputMessage.trim();
    if (!content || !currentChat) return;

    const newMessage: SingleMessage = {
      messageID: uuid.v4().toString(),
      senderID: currentUser,
      receiverID: otherUser,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setSending(true);
    setInputMessage('');
    try {
      await sendSingleMessage(currentChat, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setInputMessage(content);
      Alert.alert('Mensagem não enviada', 'Verifique a ligação e tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: SingleMessage }) => {
    const own = item.senderID === currentUser;
    return (
      <View
        style={[styles.bubble, own ? styles.userMessageContainer : styles.otherMessageContainer]}
        accessible
        accessibilityLabel={`${own ? 'Você' : otherProfile?.displayName ?? ''}: ${item.content}. ${getTimestampText(item.timestamp)}`}
      >
        <Text style={styles.message}>{item.content}</Text>
        <Text style={styles.timestamp}>{getTimestampText(item.timestamp)}</Text>
      </View>
    );
  };

  const messages = currentChat?.messageThread ?? [];
  const canSend = inputMessage.trim().length > 0 && !!currentChat && !sending;

  return (
    <KeyboardScreen>
      <ScreenHeader onBack={() => navigation.goBack()}>
        <Pressable
          style={styles.profileInfo}
          onPress={() => navigation.navigate('ProfileOtherUsers', { userId: otherUser })}
          accessibilityRole="button"
          accessibilityLabel={otherProfile ? `${otherProfile.displayName}, ver perfil` : 'Ver perfil'}
        >
          <Avatar uri={otherProfile?.profilePhoto} size={36} />
          <Text style={styles.profileName} numberOfLines={1} accessibilityRole="header">{otherProfile?.displayName ?? ''}</Text>
        </Pressable>
      </ScreenHeader>

      {book && (
        <View style={styles.bookBanner}>
          <BookSummary book={book} compact />
        </View>
      )}

      {loadingChat ? (
        <LoadingView label="A carregar conversa" />
      ) : messages.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title="Ainda sem mensagens"
          message={otherProfile ? `Envie a primeira mensagem a ${otherProfile.displayName}.` : 'Envie a primeira mensagem.'}
        />
      ) : (
        <FlatList
          data={messages.slice().reverse()}
          renderItem={renderItem}
          keyExtractor={item => item.messageID}
          inverted
          contentContainerStyle={styles.messages}
          keyboardDismissMode="interactive"
        />
      )}

      <Footer style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Escreva uma mensagem…"
          placeholderTextColor={colors.placeholder}
          accessibilityLabel="Mensagem"
          multiline
          maxLength={1000}
        />
        <IconButton
          icon="send"
          color={colors.onPrimary}
          size={20}
          onPress={sendMessage}
          disabled={!canSend}
          accessibilityLabel="Enviar mensagem"
          style={styles.sendButton}
        />
      </Footer>
    </KeyboardScreen>
  );
};

const styles = StyleSheet.create({
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  profileName: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
  bookBanner: {
    padding: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  messages: {
    padding: spacing.md,
  },
  bubble: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginVertical: spacing.xs,
    maxWidth: '80%',
  },
  userMessageContainer: {
    backgroundColor: colors.bubbleOwn,
    alignSelf: 'flex-end',
    borderBottomRightRadius: spacing.xs,
  },
  otherMessageContainer: {
    backgroundColor: colors.bubbleOther,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: spacing.xs,
  },
  message: {
    ...typography.body,
    color: colors.text,
  },
  timestamp: {
    ...typography.small,
    // Dark enough for 4.5:1 contrast on both bubble colors.
    color: '#333333',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#F0F0F5',
    borderRadius: 22,
  },
  sendButton: {
    minWidth: 44,
    minHeight: 44,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
});

export default ChatScreen;
