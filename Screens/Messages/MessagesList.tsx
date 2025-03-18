import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator, RefreshControl } from 'react-native';
import ChatCard from '../../Components/ChatCard';
import { getUserById } from '../../Services/UsersService';
import { User } from '../../Models/User';
import { FIREBASE_AUTH } from '../../config/firebase';

const MessagesList = ({ data, navigation, currentUser, onUpdate }) => {
  const [otherUsers, setOtherUsers] = useState<{ [userId: string]: User }>({});
  const [loading, setLoading] = useState(true);

  const fetchOtherUsers = async () => {
    const users = {};
    for (const chat of data) {
      const otherUserId = chat.user1 === currentUser.uid ? chat.user2 : chat.user1;
      if (!otherUsers[otherUserId]) {
        try {
          const user = await getUserById(otherUserId);
          users[otherUserId] = user;
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }
    setOtherUsers(prevState => ({ ...prevState, ...users }));
    setLoading(false);
  };

  useEffect(() => {
    fetchOtherUsers();
  }, [data, currentUser]);

  const handleCardPress = (item) => {
    if (item.user1 == FIREBASE_AUTH.currentUser.uid) {
      navigation.navigate('ChatScreen', { currentUser: item.user1, otherUser: item.user2}); // User IDs
    } else {
      navigation.navigate('ChatScreen', { currentUser: item.user2, otherUser: item.user1}); // User IDs
    }
    
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const otherUserId = item.user1 === currentUser.uid ? item.user2 : item.user1;
        const otherUser = otherUsers[otherUserId];
        return otherUser ? (
          <TouchableOpacity onPress={() => handleCardPress(item)}>
            <ChatCard
              profilePhoto={otherUser.profilePhoto}
              username={otherUser.displayName}
              messageSnippet={item.messageThread[item.messageThread.length - 1].content}
              timestamp={item.messageThread[item.messageThread.length - 1].timestamp}
              isRead={item.messageThread[item.messageThread.length - 1].isRead}
              isCurrentUser={item.messageThread[item.messageThread.length - 1].senderID === FIREBASE_AUTH.currentUser.uid}
            />
          </TouchableOpacity>
        ) : null;
      }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onUpdate}
          colors={['#9Bd35A', '#689F38']}
          progressBackgroundColor="#ffffff"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesList;
