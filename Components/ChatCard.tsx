import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const getTimestampText = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();

    const sameDay = date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();
    const sameWeek = Math.abs(date.getTime() - currentDate.getTime()) <= 6 * 24 * 60 * 60 * 1000; // within 6 days
    const sameYear = date.getFullYear() === currentDate.getFullYear();

    if (sameDay) {
        return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
    } else if (sameWeek) {
        const daysAgo = Math.ceil((currentDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
        return `há ${daysAgo} dia(s)`;
    } else if (sameYear) {
        return `${date.getDate()}/${('0' + (date.getMonth() + 1)).slice(-2)}`;
    } else {
        return `${('0' + (date.getMonth() + 1)).slice(-2)}:${date.getFullYear()}`;
    }
};

const ChatCard = ({ profilePhoto, username, messageSnippet, timestamp, isRead, isCurrentUser }) => {
    const timestampText = getTimestampText(timestamp);
    const containerStyle = isRead ? styles.container : [styles.container, styles.unreadContainer];
    const messageSnippetStyle = isCurrentUser ? styles.currentUserMessage : (isRead ? styles.messageSnippet : [styles.messageSnippet, styles.bold]);

    // Prepend "Tu: " to messageSnippet if the current user sent the last message
    const modifiedMessageSnippet = isCurrentUser ? `Tu: ${messageSnippet}` : messageSnippet;

    return (
        <View style={containerStyle}>
            {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
            ) : (
                <View style={styles.placeholder}>
                    <Ionicons name="person-circle-outline" size={50} color="#ccc" />
                </View>
            )}
            <View style={styles.contentContainer}>
                <Text style={styles.username}>{username}</Text>
                <View style={styles.messageContainer}>
                    <Text style={messageSnippetStyle}>{modifiedMessageSnippet}</Text>
                </View>
            </View>
            <Text style={styles.timestamp}>{timestampText}</Text>
            {!isRead && <View style={styles.readIconPlaceholder} />}
            {isRead && <View style={styles.readIcon}><Ionicons name="checkmark-done" size={24} color="green" /></View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    unreadContainer: {
        paddingRight: 20,
    },
    profilePhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    placeholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    messageSnippet: {
        flex: 1,
        marginRight: 10,
        fontWeight: 'normal',
    },
    bold: {
        fontWeight: 'bold',
    },
    currentUserMessage: {
        flex: 1,
        marginRight: 10,
        fontWeight: 'bold',
        color: 'blue', // Example color for current user's messages
    },
    timestamp: {
        color: 'gray',
    },
    readIcon: {
        padding: 10
    },
    readIconPlaceholder: {
        width: 24,
        height: 24,
        marginRight: 10,
    }
});

export default ChatCard;
