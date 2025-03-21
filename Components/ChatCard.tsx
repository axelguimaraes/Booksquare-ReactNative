import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getTimestampText from '../Utils/getTimestampText';

const ChatCard = ({ profilePhoto, username, messageSnippet, timestamp, isRead, isCurrentUser }) => {
    const timestampText = getTimestampText(timestamp);
    const containerStyle = isRead ? styles.container : [styles.container, styles.unreadContainer];

    let messageSnippetStyle;
    if (isCurrentUser) {
        messageSnippetStyle = styles.currentUserMessage;
    } else {
        if (isRead) {
            messageSnippetStyle = styles.messageSnippet;
        } else {
            messageSnippetStyle = [styles.messageSnippet, styles.bold];
        }
    }


    let modifiedMessageSnippet;

    if (isCurrentUser) {
        modifiedMessageSnippet = `Tu: ${messageSnippet}`;
    } else {
        modifiedMessageSnippet = messageSnippet;
    }


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
