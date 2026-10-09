import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginAnonymously } from '../../Services/AuthService';
import { getAuthErrorMessage } from '../../Utils/authErrorMessage';
import Button from '../../Components/ui/Button';
import { colors, spacing, typography } from '../../Components/ui/theme';

interface LoginScreenProps {
  navigation: any; // Adjust the type according to your navigation prop type
}

const WelcomeScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const insets = useSafeAreaInsets();

  const handleEnterAsGuest = async () => {
    setLoading(true);
    try {
      // On success the app switches to the signed-in screens.
      await loginAnonymously();
    } catch (error) {
      console.error('Error logging in anonymously:', error);
      Alert.alert('Não foi possível entrar', getAuthErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      {/* The logo artwork includes the app name and tagline */}
      <Image
        source={require('../../assets/BookSquare_final.png')}
        style={styles.logo}
        accessible
        accessibilityLabel="Booksquare. Turn the Page, Trade the Tale."
      />

      <View style={styles.actions}>
        <Button variant="onPrimary" title="Entrar" onPress={() => navigation.navigate('LoginScreen')} />
        <Button
          variant="outlineOnPrimary"
          title="Entrar como convidado"
          onPress={handleEnterAsGuest}
          loading={loading}
          accessibilityHint="Explore os livros sem conta. Comprar, vender e enviar mensagens requer uma conta."
        />
        <Pressable
          style={styles.link}
          onPress={() => navigation.navigate('RegisterScreen')}
          accessibilityRole="link"
          accessibilityLabel="Não tem uma conta? Registe-se"
        >
          <Text style={styles.registerText}>Não tem uma conta? <Text style={styles.linkEmphasis}>Registe-se</Text></Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.primary,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: '100%',
    maxWidth: 400,
    height: undefined,
    aspectRatio: 1,
  },
  actions: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  link: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...typography.body,
    color: colors.onPrimary,
  },
  linkEmphasis: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
