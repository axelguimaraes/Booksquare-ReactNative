import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getTimestampText from '../Utils/getTimestampText';
import Avatar from './ui/Avatar';
import { colors, spacing, typography } from './ui/theme';

interface Props {
    profilePhoto?: string;
    username: string;
    // Last message of the conversation; undefined when nothing was sent yet.
    lastMessage?: { content: string, timestamp: string, isRead: boolean };
    isCurrentUser: boolean;
    onPress: () => void;
}

const ChatCard: React.FC<Props> = ({ profilePhoto, username, lastMessage, isCurrentUser, onPress }) => {
    // Unread only matters for messages the other person sent.
    const unread = !!lastMessage && !isCurrentUser && !lastMessage.isRead;
    const snippet = !lastMessage ? 'Sem mensagens' : isCurrentUser ? `Tu: ${lastMessage.content}` : lastMessage.content;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Conversa com ${username}. ${unread ? 'Mensagem não lida. ' : ''}${snippet}`}
        >
            <Avatar uri={profilePhoto} size={50} />
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.username, unread && styles.bold]} numberOfLines={1}>{username}</Text>
                    {lastMessage && (
                        <Text style={[styles.timestamp, unread && styles.unreadTimestamp]}>{getTimestampText(lastMessage.timestamp)}</Text>
                    )}
                </View>
                <View style={styles.messageRow}>
                    {isCurrentUser && lastMessage && (
                        <Ionicons
                            name={lastMessage.isRead ? 'checkmark-done' : 'checkmark'}
                            size={16}
                            color={lastMessage.isRead ? colors.primary : colors.textSecondary}
                            style={styles.readIcon}
                        />
                    )}
                    <Text style={[styles.messageSnippet, unread && styles.unreadSnippet]} numberOfLines={1}>{snippet}</Text>
                    {unread && <View style={styles.unreadDot} />}
                </View>
            </View>
        </Pressable>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 72,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
    },
    pressed: {
        backgroundColor: colors.surface,
    },
    contentContainer: {
        flex: 1,
        marginLeft: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    username: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
        flexShrink: 1,
    },
    bold: {
        fontWeight: 'bold',
    },
    timestamp: {
        ...typography.small,
        color: colors.textSecondary,
        marginLeft: spacing.sm,
    },
    unreadTimestamp: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    readIcon: {
        marginRight: spacing.xs,
    },
    messageSnippet: {
        ...typography.caption,
        flex: 1,
        color: colors.textSecondary,
    },
    unreadSnippet: {
        color: colors.text,
        fontWeight: 'bold',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        marginLeft: spacing.sm,
    },
});

export default ChatCard;
