import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllNotifications, markNotificationAsRead, deleteAllNotifications } from '../../Services/NotificationsService';
import { Notification, NotificationType } from '../../Models/Notification';
import getTimestampText from '../../Utils/getTimestampText';
import Banner from '../../Components/ui/Banner';
import IconButton from '../../Components/ui/IconButton';
import { EmptyState, LoadingView } from '../../Components/ui/StateViews';
import { colors, spacing, typography } from '../../Components/ui/theme';

const icons: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  [NotificationType.SALE]: 'pricetag-outline',
  [NotificationType.PURCHASE]: 'cart-outline',
  [NotificationType.TRADE]: 'swap-horizontal',
  [NotificationType.RENT]: 'calendar-outline',
  [NotificationType.MESSAGE]: 'chatbubble-outline',
};

const NotificationsComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  useEffect(() => {
    getAllNotifications().then((data) => {
      setNotifications([...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    });
  }, []);

  const markAsRead = (id: number) => {
    markNotificationAsRead(id).then(() => {
      setNotifications((current) =>
        current.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification))
      );
    });
  };

  const deleteAll = () => {
    Alert.alert(
      'Eliminar notificações?',
      'Todas as notificações serão eliminadas. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteAllNotifications().then(() => setNotifications([]));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable
      style={({ pressed }) => [styles.notificationItem, pressed && styles.pressed]}
      onPress={() => !item.isRead && markAsRead(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${item.isRead ? '' : 'Não lida. '}${item.message}. ${getTimestampText(item.timestamp)}`}
      accessibilityHint={item.isRead ? undefined : 'Marca como lida'}
    >
      <View style={[styles.icon, !item.isRead && styles.unreadIcon]}>
        <Ionicons name={icons[item.notificationType] ?? 'notifications-outline'} size={20} color={item.isRead ? colors.textSecondary : colors.onPrimary} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.notificationText, !item.isRead && styles.unreadText]}>{item.message}</Text>
        <Text style={styles.timestamp}>{getTimestampText(item.timestamp)}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} accessibilityRole="header">Notificações</Text>
        <IconButton
          icon="trash-outline"
          onPress={deleteAll}
          disabled={!notifications?.length}
          accessibilityLabel="Eliminar todas as notificações"
        />
      </View>
      <Banner message="As notificações ainda não estão ligadas ao servidor: os dados apresentados são de exemplo." style={styles.banner} />
      {notifications === null ? (
        <LoadingView label="A carregar notificações" />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={notifications.length === 0 && styles.emptyList}
          ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="Sem notificações" message="Quando houver novidades, aparecem aqui." />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
  },
  banner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  unreadIcon: {
    backgroundColor: colors.primary,
  },
  texts: {
    flex: 1,
    marginLeft: spacing.md,
  },
  notificationText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  unreadText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  timestamp: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 72,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default NotificationsComponent;
