import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors, spacing, typography } from './theme';

export const LoadingView: React.FC<{ label?: string }> = ({ label = 'A carregar' }) => (
  <View style={styles.centered} accessible accessibilityLabel={label} accessibilityRole="progressbar">
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  action?: { label: string, onPress: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => (
  <View style={styles.centered}>
    <Ionicons name={icon} size={56} color={colors.primaryLight} />
    <Text style={styles.title} accessibilityRole="header">{title}</Text>
    {message && <Text style={styles.message}>{message}</Text>}
    {action && <Button title={action.label} onPress={action.onPress} style={styles.action} />}
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
  },
});
