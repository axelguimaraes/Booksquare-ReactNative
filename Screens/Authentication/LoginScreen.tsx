import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { loginWithEmailAndPassword } from "../../Services/AuthService";
import { getAuthErrorMessage } from "../../Utils/authErrorMessage";
import AuthLayout from "./AuthLayout";
import Banner from "../../Components/ui/Banner";
import Button from "../../Components/ui/Button";
import IconButton from "../../Components/ui/IconButton";
import TextField from "../../Components/ui/TextField";
import { colors, spacing, typography } from "../../Components/ui/theme";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<TextInput>(null)

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      setError("Introduza o email e a palavra-passe.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // On success the app switches to the signed-in screens.
      await loginWithEmailAndPassword(email.trim(), password);
    } catch (e) {
      console.log(e);
      setError(getAuthErrorMessage(e));
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciar sessão" onBack={() => navigation.goBack()}>
      <TextField
        inverse
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="nome@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />
      <TextField
        inverse
        ref={passwordInputRef}
        label="Palavra-passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleEmailLogin}
        right={
          <IconButton
            icon={showPassword ? "eye-off-outline" : "eye-outline"}
            accessibilityLabel={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
            onPress={() => setShowPassword((prev) => !prev)}
          />
        }
      />

      {error && <Banner tone="error" message={error} style={styles.banner} />}

      <Button variant="onPrimary" title="Entrar" onPress={handleEmailLogin} loading={loading} style={styles.button} />

      <Pressable
        style={styles.link}
        onPress={() => navigation.navigate("RegisterScreen", undefined, { pop: true })}
        accessibilityRole="link"
        accessibilityLabel="Não tem uma conta? Registe-se"
      >
        <Text style={styles.linkText}>Não tem uma conta? <Text style={styles.linkEmphasis}>Registe-se</Text></Text>
      </Pressable>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
  link: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },
  linkText: {
    ...typography.body,
    color: colors.onPrimary,
  },
  linkEmphasis: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
