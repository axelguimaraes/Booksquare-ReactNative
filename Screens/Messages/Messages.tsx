import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import MessagesList from './MessagesList';
import { getUserById } from '../../Services/UsersService';
import { Chat } from '../../Models/Chat';
import { FIREBASE_AUTH } from '../../config/firebase';
import { getAllUserChats, getChat } from '../../Services/ChatService';

const Messages = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userChats = await getAllUserChats(FIREBASE_AUTH.currentUser.uid);
        setChats(userChats);
      } catch (error) {
        console.error('Error retrieving chats:', error);
      }
    };

    fetchMessages();
  }, [chats]);

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <View style={styles.content}>
        <MessagesList data={chats} navigation={navigation} currentUser={FIREBASE_AUTH.currentUser} />
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
});

export default Messages;
