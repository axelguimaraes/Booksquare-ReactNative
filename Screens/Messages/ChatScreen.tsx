import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import getTimestampText from '../../Utils/getTimestampText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../Models/User';
import { Book } from '../../Models/Book';

interface Props {
  currentUser: User;
  otherUser: User;
  book: Book;
}

const ChatScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const { currentUser, otherUser, book } = route.params as { currentUser: User; otherUser: User; book: Book };

  const [messages, setMessages] = useState([
    { id: '1', sender: 'user1', content: 'Olá!', timestamp: '2024-01-28T10:00:00' },
    { id: '2', sender: 'user2', content: 'Heyyyy!', timestamp: '2024-01-28T10:05:00' },
    { id: '3', sender: 'user1', content: 'Como estás?', timestamp: '2024-01-28T10:10:00' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const renderItem = ({ item }) => (
    <View style={item.sender === 'user1' ? styles.userMessageContainer : styles.otherMessageContainer}>
      <Text style={styles.message}>{item.content}</Text>
      <Text style={styles.timestamp}>{getTimestampText(item.timestamp)}</Text>
    </View>
  );

  const renderProfilePhoto = () => {
    if (otherUser.profilePhoto) {
      return (
        <Image source={{ uri: otherUser.profilePhoto }} style={styles.profilePhoto} />
      );
    } else {
      return (
        <View style={styles.profilePhotoPlaceholder}>
          <Ionicons name="person-circle-outline" size={40} color="#ccc" />
        </View>
      );
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        id: (messages.length + 1).toString(),
        sender: 'user1', // Assuming current user is user1
        content: inputMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          {renderProfilePhoto()}
          <Text style={styles.profileName}>{otherUser.displayName}</Text>
        </View>
      </View>

      <View style={styles.bookContainer}>
        <Image source={{ uri: book.photos[0] }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.price}>Preço: {book.price} €</Text>
        </View>
      </View>

      <FlatList
        data={messages.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Escreva uma mensagem..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 20
  },
  profilePhotoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userMessageContainer: {
    backgroundColor: '#b9aaa3',
    alignSelf: 'flex-end',
    borderRadius: 8,
    padding: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  otherMessageContainer: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 8,
    marginVertical: 5,
    maxWidth: '80%',
  },
  message: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F0F0F5',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#8C756A',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 10
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
});

export default ChatScreen;
