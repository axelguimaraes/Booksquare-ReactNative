import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import MessagesList from './MessagesList';
import { Chat } from '../../Models/Chat';
import { getCurrentUser } from '../../Services/AuthService';
import { getAllUserChats } from '../../Services/ChatService';
import { useFocusEffect } from '@react-navigation/native';
import { EmptyState, LoadingView } from '../../Components/ui/StateViews';
import { colors, spacing, typography } from '../../Components/ui/theme';

const lastMessageTime = (chat: Chat) => {
  const last = chat.messageThread[chat.messageThread.length - 1];
  return last ? new Date(last.timestamp).getTime() : 0;
};

const Messages = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [error, setError] = useState(false);

  const fetchMessages = async () => {
    try {
      const userChats = await getAllUserChats(getCurrentUser().uid);
      // Most recent conversation first
      setChats([...userChats].sort((a, b) => lastMessageTime(b) - lastMessageTime(a)));
      setError(false);
    } catch (e) {
      console.error('Error retrieving chats:', e);
      setError(true);
      setChats((current) => current ?? []);
    }
  };

  // Refresh whenever the screen comes into focus, e.g. after replying in a chat
  useFocusEffect(
    React.useCallback(() => {
      fetchMessages();
    }, [])
  );

  const renderContent = () => {
    if (chats === null) {
      return <LoadingView label="A carregar mensagens" />;
    }
    if (chats.length === 0) {
      return error ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Não foi possível carregar as mensagens"
          action={{ label: 'Tentar novamente', onPress: fetchMessages }}
        />
      ) : (
        <EmptyState
          icon="chatbubbles-outline"
          title="Sem mensagens"
          message="Contacte quem publicou um livro a partir dos detalhes do livro."
        />
      );
    }
    return <MessagesList data={chats} navigation={navigation} currentUser={getCurrentUser()} onUpdate={fetchMessages} />;
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <Text style={styles.title} accessibilityRole="header">Mensagens</Text>
      <View style={styles.content}>{renderContent()}</View>
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  content: {
    flex: 1,
  },
});

export default Messages;
