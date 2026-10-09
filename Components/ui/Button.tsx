import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, touchTarget } from './theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'onPrimary' | 'outlineOnPrimary';

interface Props {
  title: string;
  onPress: () => void;
  // primary: main action. secondary/danger: outlined. onPrimary/outlineOnPrimary: for brand-colored backgrounds.
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const palette: Record<Variant, { background: string, border: string, text: string }> = {
  primary: { background: colors.primary, border: colors.primary, text: colors.onPrimary },
  secondary: { background: colors.background, border: colors.primary, text: colors.primary },
  danger: { background: colors.background, border: colors.danger, text: colors.danger },
  onPrimary: { background: colors.background, border: colors.background, text: colors.primary },
  outlineOnPrimary: { background: 'transparent', border: colors.onPrimary, text: colors.onPrimary },
};

const Button: React.FC<Props> = ({ title, onPress, variant = 'primary', icon, loading = false, disabled = false, accessibilityHint, style }) => {
  const { background, border, text } = palette[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, borderColor: border },
        variant === 'onPrimary' && styles.raised,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={text} />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={20} color={text} style={styles.icon} />}
          <Text style={[styles.text, { color: text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: touchTarget,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  raised: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Button;
