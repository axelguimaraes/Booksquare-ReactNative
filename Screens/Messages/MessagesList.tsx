import React from 'react';
import { View, FlatList } from 'react-native';
import ChatCard from '../../Components/ChatCard';
import { getUserById } from '../../Services/UsersService';

const MessagesList = ({ data }) => {
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatCard
            profilePhoto={getUserById(item.senderID).profilePhoto}
            username={getUserById(item.senderID).username}
            messageSnippet={item.content}
            timestamp={item.timestamp}
            isRead={item.isRead}
          />
        )}
      />
    </View>
  );
};

export default MessagesList;
