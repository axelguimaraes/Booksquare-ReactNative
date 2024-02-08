import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import ChatCard from '../../Components/ChatCard';
import { getUserById } from '../../Services/UsersService';

const MessagesList = ({ data, navigation, currentUser }) => {
  const handleCardPress = (message) => {
    navigation.navigate('MessageThreadScreen', { message });
  };

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const otherUserId = item.messageThread[0].senderID === currentUser.id ? item.messageThread[0].receiverID : item.messageThread[0].senderID;
          const otherUser = getUserById(otherUserId);
          const isCurrentUser = currentUser.id === otherUserId; // Determine if the current user is the sender or receiver

          return (
            <TouchableOpacity onPress={() => handleCardPress(item)}>
              <ChatCard
                profilePhoto={otherUser.profilePhoto}
                username={otherUser.username}
                messageSnippet={item.messageThread[item.messageThread.length - 1].content}
                timestamp={item.messageThread[item.messageThread.length - 1].timestamp}
                isRead={item.messageThread[item.messageThread.length - 1].isRead}
                isCurrentUser={isCurrentUser} // Pass isCurrentUser prop to ChatCard
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default MessagesList;
