import React from 'react';
import { Image, ImageResizeMode, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from './ui/theme';

interface Props {
  uri?: string;
  width: number;
  height: number;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ViewStyle>;
}

// Book photo, or a placeholder when the listing has none (instead of a spinner that never ends).
const BookCover: React.FC<Props> = ({ uri, width, height, resizeMode = 'cover', style }) => (
  <View style={[styles.frame, { width, height }, style]} accessibilityIgnoresInvertColors>
    {uri ? (
      <Image source={{ uri }} style={styles.image} resizeMode={resizeMode} />
    ) : (
      <Ionicons name="book-outline" size={Math.min(width, height) * 0.4} color={colors.primaryLight} />
    )}
  </View>
);

const styles = StyleSheet.create({
  frame: {
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default BookCover;
