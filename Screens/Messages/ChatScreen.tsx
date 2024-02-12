import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import getTimestampText from '../../Utils/getTimestampText';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
    const navigation = useNavigation();

    const [messages, setMessages] = useState([
        { id: '1', sender: 'user1', content: 'Hello!', timestamp: '2024-01-28T10:00:00' },
        { id: '2', sender: 'user2', content: 'Hi there!', timestamp: '2024-01-28T10:05:00' },
        { id: '3', sender: 'user1', content: 'How are you?', timestamp: '2024-01-28T10:10:00' },
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const renderItem = ({ item }) => (
        <View style={item.sender === 'user1' ? styles.userMessageContainer : styles.otherMessageContainer}>
            <Text style={styles.message}>{item.content}</Text>
            <Text style={styles.timestamp}>{getTimestampText(item.timestamp)}</Text>
        </View>
    );

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
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.profileInfo}>
                    <Image source={{ uri: 'https://via.placeholder.com/150/foto1.jpg' }} style={styles.profilePhoto} />
                    <Text style={styles.profileName}>Other User</Text>
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
        </View>
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
        //justifyContent: 'space-between',
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
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userMessageContainer: {
        backgroundColor: '#DCF8C6',
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
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ChatScreen;
