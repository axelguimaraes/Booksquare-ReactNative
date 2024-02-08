import React from 'react';
import { View, FlatList } from 'react-native';
import ChatCard from '../../Components/ChatCard';

const MessagesList = ({ data }) => {
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatCard
            profilePhoto={item.sender.profilePhoto}
            username={item.sender.username}
            messageSnippet={item.content} // Update to message content
            timestamp={item.timestamp}
            isRead={true} // Update according to your logic for isRead
          />
        )}
      />
    </View>
  );
};

export default MessagesList;
