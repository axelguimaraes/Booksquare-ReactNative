import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import ChatCard from '../../Components/ChatCard';
import { getUserById } from '../../Services/UsersService';
import { Chat } from '../../Models/Chat';
import { AuthUser, User } from '../../Models/User';
import { LoadingView } from '../../Components/ui/StateViews';
import { colors } from '../../Components/ui/theme';

interface Props {
  data: Chat[];
  navigation: any;
  currentUser: AuthUser;
  onUpdate: () => Promise<void>;
}

const MessagesList: React.FC<Props> = ({ data, navigation, currentUser, onUpdate }) => {
  const [otherUsers, setOtherUsers] = useState<{ [userId: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const otherUserIdOf = (chat: Chat) => (chat.user1 === currentUser.uid ? chat.user2 : chat.user1);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      const missing = data.map(otherUserIdOf).filter((id) => !otherUsers[id]);
      const users = await Promise.all(missing.map((id) => getUserById(id).catch((error) => {
        console.error('Error fetching user:', error);
        return null;
      })));
      setOtherUsers((prevState) => {
        const next = { ...prevState };
        users.forEach((user) => {
          if (user) next[user.userId] = user;
        });
        return next;
      });
      setLoading(false);
    };

    fetchOtherUsers();
  }, [data, currentUser]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingView label="A carregar mensagens" />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const otherUserId = otherUserIdOf(item);
        const otherUser = otherUsers[otherUserId];
        const lastMessage = item.messageThread[item.messageThread.length - 1];
        return otherUser ? (
          <ChatCard
            profilePhoto={otherUser.profilePhoto}
            username={otherUser.displayName}
            lastMessage={lastMessage}
            isCurrentUser={lastMessage?.senderID === currentUser.uid}
            onPress={() => navigation.navigate('ChatScreen', { currentUser: currentUser.uid, otherUser: otherUserId })}
          />
        ) : null;
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    />
  );
};

export default MessagesList;
