import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import getTimestampText from '../../Utils/getTimestampText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../Models/User';
import { Book } from '../../Models/Book';
import { getChat, markAllMessagesAsRead, sendSingleMessage, subscribeToChat } from '../../Services/ChatService';
import { Chat, SingleMessage } from '../../Models/Chat';
import uuid from 'react-native-uuid';
import { getUserById } from '../../Services/UsersService';
import { FIREBASE_AUTH } from '../../config/firebase';

interface Props {
  currentUser: User;
  otherUser: User;
  book: Book;
}

const ChatScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const { currentUser, otherUser, book } = route.params as { currentUser: string; otherUser: string; book: Book };

  const [messages, setMessages] = useState<SingleMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat>(null)
  const [user1, setUser1] = useState<User>()
  const [user2, setUser2] = useState<User>()

  useEffect(() => {
    setLoading(true);

    const fetchUsers = async () => {
      try {
        const fetchedUser1 = await getUserById(currentUser);
        const fetchedUser2 = await getUserById(otherUser);
        setUser1(fetchedUser1);
        setUser2(fetchedUser2);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, otherUser]);

  useEffect(() => {
    if (user1 && user2) {
      const fetchChat = async () => {
        try {
          const fetchedChat: Chat = await getChat(currentUser, otherUser);
          setCurrentChat(fetchedChat);
          setLoading(false);
          const unsubscribe = subscribeToChat(user1.userId, user2.userId, (updatedChat: Chat | null) => {
            setCurrentChat(updatedChat);
          });
          return unsubscribe;
        } catch (error) {
          console.error('Error fetching chat:', error);
          setLoading(false);
        }
      };

      fetchChat();
    }
  }, [user1, user2]);

  useEffect(() => {
    // Update messages state when currentChat changes
    if (currentChat) {
      setMessages(currentChat.messageThread);
    }
  }, [currentChat]);

  useEffect(() => {
    if (user1 && user2 && currentChat) {
      markAllMessagesAsRead(currentChat.id, FIREBASE_AUTH.currentUser.uid)
        .catch(error => console.error('Error marking messages as read:', error));
    }
  }, [user1, user2, currentChat])

  const renderItem = ({ item }) => (
    <View key={item.messageID} style={item.senderID === user1.userId ? styles.userMessageContainer : styles.otherMessageContainer}>
      <Text style={styles.message}>{item.content}</Text>
      <Text style={styles.timestamp}>{getTimestampText(item.timestamp)}</Text>
    </View>
  );

  const renderProfilePhoto = () => {
    if (user2.profilePhoto) {
      return (
        <Image source={{ uri: user2.profilePhoto }} style={styles.profilePhoto} />
      );
    } else {
      return (
        <View style={styles.profilePhotoPlaceholder}>
          <Ionicons name="person-circle-outline" size={50} color="#ccc" />
        </View>
      );
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        messageID: uuid.v4().toString(),
        senderID: user1.userId,
        receiverID: user2.userId,
        content: inputMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      try {
        await sendSingleMessage(currentChat, newMessage);
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error
      }
    }
  };

  if (!user1 || !user2) {
    // Render a loading indicator or return null if user data is not yet available
    return <ActivityIndicator size="large" color="grey" />;
  }

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          {renderProfilePhoto()}
          <Text style={styles.profileName}>{user2.displayName}</Text>
        </View>
      </View>

      {book &&
        <View style={styles.bookContainer}>
          <Image source={{ uri: book.photos[0] }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.title}>{book.title}</Text>
            {book.price &&
              <Text style={styles.price}>Preço: {book.price} €</Text>
            }
            {book.rentalPricePerDay &&
              <Text style={styles.price}>Preço por dia: {book.rentalPricePerDay} €</Text>
            }
          </View>
        </View>
      }

      <FlatList
        data={messages.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.messageID}
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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
