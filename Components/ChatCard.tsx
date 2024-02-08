import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatCard = ({ profilePhoto, username, messageSnippet, timestamp, isRead }) => {
  return (
    <View style={styles.container}>
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
          <Text style={styles.messageSnippet}>{messageSnippet}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
      {isRead && <Ionicons name="checkmark-done" size={24} color="green" />}
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
  },
  timestamp: {
    color: 'gray',
  },
});

export default ChatCard;
