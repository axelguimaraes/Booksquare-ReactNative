import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, touchTarget } from './theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  // Required: icon-only buttons have no visible text for screen readers to announce.
  accessibilityLabel: string;
  onPress: () => void;
  color?: string;
  size?: number;
  // Shows a count bubble on the icon (e.g. cart items); hidden when 0.
  badge?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const IconButton: React.FC<Props> = ({ icon, accessibilityLabel, onPress, color = colors.text, size = 24, badge = 0, disabled = false, style }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{ disabled }}
    hitSlop={4}
    style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled, style]}
  >
    <View>
      <Ionicons name={icon} size={size} color={color} />
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText} maxFontSizeMultiplier={1.2}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      )}
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default IconButton;
