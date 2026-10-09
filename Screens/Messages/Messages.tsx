import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import MessagesList from './MessagesList';
import { Chat } from '../../Models/Chat';
import { getCurrentUser } from '../../Services/AuthService';
import { getAllUserChats } from '../../Services/ChatService';
import { useFocusEffect } from '@react-navigation/native';

const Messages = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const fetchMessages = async () => {
    try {
      const userChats = await getAllUserChats(getCurrentUser().uid);
      setChats(userChats);
    } catch (error) {
      console.error('Error retrieving chats:', error);
    }
  };

  // Use the useFocusEffect hook to run the fetchMessages function when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchMessages();
    }, []) // Empty dependency array means this effect only runs once when the component mounts
  );

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <View style={styles.content}>
        {chats.length !== 0 ? (
          <MessagesList data={chats} navigation={navigation} currentUser={getCurrentUser()} onUpdate={fetchMessages}/>
        ) : (
          <View style={styles.containerEmpty}>
            <Text style={styles.containerEmptyMessage}>Sem mensagens a apresentar.</Text>
          </View>
        )}
      </View>
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerEmptyMessage: {
    textAlign: 'center',
    color: 'grey',
    fontSize: 18
  },
});

export default Messages;
