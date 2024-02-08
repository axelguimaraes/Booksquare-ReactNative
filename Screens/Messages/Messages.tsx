import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../../Components/TopBar';
import BottomBar from '../../Components/BottomBar';
import MessagesList from './MessagesList';
import { getMessagesByUserId } from '../../Services/MessagesService';

const Messages = ({ navigation }) => {
  const [messages, setMessages] = useState([]); 

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userId = 1;
        const userMessages = getMessagesByUserId(userId);
        setMessages(userMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    console.log("Messages:", messages)
    fetchMessages();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />
      <View style={styles.content}>
        <MessagesList data={messages} />
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
