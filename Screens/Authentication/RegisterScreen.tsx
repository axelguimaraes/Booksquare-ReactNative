import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { registerWithEmailAndPassword } from '../../Services/AuthService';
import { getAuthErrorMessage } from '../../Utils/authErrorMessage';
import AuthLayout from './AuthLayout';
import Banner from '../../Components/ui/Banner';
import Button from '../../Components/ui/Button';
import IconButton from '../../Components/ui/IconButton';
import TextField from '../../Components/ui/TextField';
import { colors, spacing, typography } from '../../Components/ui/theme';

type Field = 'username' | 'email' | 'password' | 'passwordConfirm';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({})
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false);

    const emailInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)
    const confirmPasswordInputRef = useRef<TextInput>(null)

    const validate = () => {
        const errors: Partial<Record<Field, string>> = {};
        if (!username.trim()) {
            errors.username = 'Introduza um nome de utilizador.';
        }
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            errors.email = 'Introduza um email válido.';
        }
        if (password.length < 6) {
            errors.password = 'A palavra-passe deve ter pelo menos 6 caracteres.';
        }
        if (passwordConfirm !== password) {
            errors.passwordConfirm = 'As palavras-passe não coincidem.';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleRegister = async () => {
        setError(null)
        if (!validate()) {
            return
        }

        setLoading(true)
        try {
            // On success the new account is signed in and the app switches to the signed-in screens.
            await registerWithEmailAndPassword(email.trim(), password, username.trim())
        } catch (e) {
            console.log(e)
            setError(getAuthErrorMessage(e))
            setLoading(false)
        }
    };

    const passwordToggle = (
        <IconButton
            icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            accessibilityLabel={showPassword ? 'Ocultar palavras-passe' : 'Mostrar palavras-passe'}
            onPress={() => setShowPassword((prev) => !prev)}
        />
    );

    return (
        <AuthLayout title="Criar conta" onBack={() => navigation.goBack()}>
            <TextField
                inverse
                label="Nome de utilizador"
                hint="É o nome que os outros utilizadores veem."
                error={fieldErrors.username}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="nickname"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => emailInputRef.current?.focus()}
            />
            <TextField
                inverse
                ref={emailInputRef}
                label="Email"
                error={fieldErrors.email}
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
                hint="Mínimo de 6 caracteres."
                error={fieldErrors.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                right={passwordToggle}
            />
            <TextField
                inverse
                ref={confirmPasswordInputRef}
                label="Confirmar palavra-passe"
                error={fieldErrors.passwordConfirm}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="go"
                onSubmitEditing={handleRegister}
            />

            {error && <Banner tone="error" message={error} style={styles.banner} />}

            <Button variant="onPrimary" title="Criar conta" onPress={handleRegister} loading={loading} style={styles.button} />

            <Pressable
                style={styles.link}
                onPress={() => navigation.navigate('LoginScreen', undefined, { pop: true })}
                accessibilityRole="link"
                accessibilityLabel="Já tem uma conta? Inicie sessão"
            >
                <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkEmphasis}>Inicie sessão</Text></Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    linkText: {
        ...typography.body,
        color: colors.onPrimary,
    },
    linkEmphasis: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
