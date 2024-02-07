import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllNotifications, markNotificationAsRead } from '../../Services/NotificationsService';
import { Notification } from '../../Models/Notification';
import Snackbar from 'react-native-snackbar';

const NotificationsComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    getAllNotifications().then((data) => {
      setNotifications(data);
    });
  };

  const markAsRead = (id: number, isRead: boolean) => {
    const action = isRead ? 'marked as read' : 'marked as unread';
    markNotificationAsRead(id).then(() => {
      /*
      Snackbar.show({
        text: `Message ${action}`,
        duration: Snackbar.LENGTH_SHORT,
      });
      */
      // Refresh notifications after marking as read/unread
      fetchNotifications();
    });
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => markAsRead(item.id, !item.isRead)}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.isRead ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.isRead ? 'green' : 'red'}
        />
      </View>
      <Text style={styles.notificationText}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={<Text>No notifications available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
});

export default NotificationsComponent;
