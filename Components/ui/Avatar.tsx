import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme';

interface Props {
  uri?: string | null;
  size?: number;
}

// Profile photo, or a person icon when there is none. Decorative: the name is always shown next to it.
const Avatar: React.FC<Props> = ({ uri, size = 48 }) => {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  return uri ? (
    <Image source={{ uri }} style={[styles.image, shape]} accessibilityIgnoresInvertColors />
  ) : (
    <View style={[styles.placeholder, shape]}>
      <Ionicons name="person" size={size * 0.55} color={colors.onPrimary} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceAlt,
  },
  placeholder: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Avatar;
