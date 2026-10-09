import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from './theme';

interface Props {
  message: string;
  tone?: 'error' | 'info';
  style?: StyleProp<ViewStyle>;
}

const tones = {
  error: { icon: 'alert-circle' as const, background: '#FDECEA', color: colors.danger },
  info: { icon: 'information-circle' as const, background: colors.surface, color: colors.textSecondary },
};

// Message about a whole form or screen (a failed sign-in, a feature that only simulates data...).
const Banner: React.FC<Props> = ({ message, tone = 'info', style }) => {
  const { icon, background, color } = tones[tone];
  return (
    <View
      style={[styles.banner, { backgroundColor: background }, style]}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion={tone === 'error' ? 'assertive' : 'none'}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.text, tone === 'error' && { color }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.sm,
  },
  text: {
    ...typography.caption,
    flex: 1,
    color: colors.text,
    marginLeft: spacing.sm,
    lineHeight: 20,
  },
});

export default Banner;
