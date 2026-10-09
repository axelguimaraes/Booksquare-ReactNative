import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconButton from './IconButton';
import { colors, spacing, typography, touchTarget } from './theme';

interface Props {
  title?: string;
  onBack?: () => void;
  // Defaults to a back arrow; modals use 'close'.
  backIcon?: keyof typeof Ionicons.glyphMap;
  backLabel?: string;
  // Replaces the centered title, e.g. an avatar and name in a chat.
  children?: React.ReactNode;
  right?: React.ReactNode;
}

// Header for pushed (secondary) screens: back button, title and an optional action.
const ScreenHeader: React.FC<Props> = ({ title, onBack, backIcon, backLabel = 'Voltar', children, right }) => (
  <View style={styles.header}>
    <View style={styles.side}>
      {onBack && (
        <IconButton
          icon={backIcon ?? (Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back')}
          accessibilityLabel={backLabel}
          onPress={onBack}
          size={26}
        />
      )}
    </View>
    {children ? (
      <View style={styles.custom}>{children}</View>
    ) : (
      <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>{title}</Text>
    )}
    <View style={[styles.side, styles.right]}>{right}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  side: {
    minWidth: touchTarget,
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    ...typography.heading,
    flex: 1,
    textAlign: 'center',
    color: colors.text,
  },
  custom: {
    flex: 1,
  },
});

export default ScreenHeader;
