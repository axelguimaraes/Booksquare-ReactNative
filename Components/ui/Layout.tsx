import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from './theme';

// Screen root that moves its content above the keyboard. KeyboardAvoidingView measures itself
// relative to its parent, so the offset is the status bar inset the root SafeAreaView adds above
// every screen. Android is edge-to-edge, so the window no longer resizes for the keyboard there
// either and 'padding' is right on both platforms.
export const KeyboardScreen: React.FC<{ children: React.ReactNode, style?: StyleProp<ViewStyle> }> = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={insets.top} style={[styles.screen, style]}>
      {children}
    </KeyboardAvoidingView>
  );
};

export const useKeyboardVisible = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
};

// Action bar pinned to the bottom of a screen, clear of the home indicator / navigation bar
// (not needed while the keyboard covers them). Pass inset={false} when the bottom bar is below it
// and already takes care of that.
export const Footer: React.FC<{ children: React.ReactNode, inset?: boolean, style?: StyleProp<ViewStyle> }> = ({ children, inset = true, style }) => {
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const bottom = inset && !keyboardVisible ? Math.max(insets.bottom, spacing.md) : spacing.md;
  return (
    <View style={[styles.footer, { paddingBottom: bottom }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
