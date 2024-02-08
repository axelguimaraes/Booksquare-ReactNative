import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllNotifications, markNotificationAsRead, deleteAllNotifications } from '../../Services/NotificationsService';
import { Notification } from '../../Models/Notification';

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
    markNotificationAsRead(id).then(() => {
      setNotifications(prevNotifications => {
        return prevNotifications.map(notification => {
          if (notification.id === id) {
            return { ...notification, isRead };
          }
          return notification;
        });
      });
    });
  };

  const deleteAll = () => {
    Alert.alert(
      'Alerta de confirmação',
      'Tem a certeza que quer eliminar todas as notificações?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            deleteAllNotifications().then(() => {
              setNotifications([]);
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => markAsRead(item.id, !item.isRead)}
    >
      <Text style={styles.notificationText}>{item.message}</Text>
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.isRead ? 'mail-open-outline' : 'mail-unread-outline'}
          color={item.isRead ? 'lightgray' : 'black'}
          size={24}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificações</Text>
        <TouchableOpacity onPress={deleteAll}>
          <Ionicons name="trash-bin-outline" size={24} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={<Text style={styles.noNotificationsText}>Sem notificações de momento.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  noNotificationsText: {
    padding: 10,
  }
});

export default NotificationsComponent;
