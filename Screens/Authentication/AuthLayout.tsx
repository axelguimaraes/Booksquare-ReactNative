import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../../Components/ui/IconButton';
import { KeyboardScreen } from '../../Components/ui/Layout';
import { colors, spacing, typography } from '../../Components/ui/theme';

interface Props {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

// Shared frame of the sign-in and registration forms: back button, logo, title, and content
// that scrolls and stays above the keyboard.
const AuthLayout: React.FC<Props> = ({ title, onBack, children }) => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardScreen style={styles.screen}>
      <View style={styles.topBar}>
        <IconButton
          icon={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
          color={colors.onPrimary}
          size={26}
          accessibilityLabel="Voltar"
          onPress={onBack}
        />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require('../../assets/BookSquare_final.png')} style={styles.logo} accessibilityIgnoresInvertColors />
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        {children}
      </ScrollView>
    </KeyboardScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.primary,
  },
  topBar: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xs,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  logo: {
    width: '70%',
    maxWidth: 260,
    height: undefined,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  title: {
    ...typography.title,
    color: colors.onPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default AuthLayout;
