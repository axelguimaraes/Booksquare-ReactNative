import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerWithEmailAndPassword } from '../../Services/AuthService';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = (text) => setEmail(text);
    const handleUsernameChange = (text) => setUsername(text)
    const handlePasswordChange = (text) => setPassword(text);
    const handlePasswordConfirmChange = (text) => setPasswordConfirm(text);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const isValid = () => {
        if (!username || !email || !password || !passwordConfirm) {
            setError('Todos os campos devem ser preenchidos!');
            return false;
        }
        if (password !== passwordConfirm) {
            setError('As palavras-passe não coincidem');
            return false;
        }
        return true;
    }

    const handleRegister = async () => {
        if (!isValid()) {
            alert(error)
            return
        }

        setLoading(true)
        try {
            await registerWithEmailAndPassword(email, password, username)
        } finally {
            setLoading(false)
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.halfContainer}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    {/* Your logo component goes here */}
                    <Image source={require('../../assets/BookSquare_final.png')} style={styles.logo} />
                </View>
            </View>
            <View style={styles.halfContainer}>
                {/* Login Form */}
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={handleEmailChange}
                        placeholder="Email"
                        autoCapitalize='none'
                    />
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={handleUsernameChange}
                        placeholder="Nome de utilizador"
                        autoCapitalize='none'
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={handlePasswordChange}
                        placeholder="Palavra-passe"
                        secureTextEntry={showPassword ? false : true}
                        autoCapitalize='none'
                    />
                    <TextInput
                        style={styles.input}
                        value={passwordConfirm}
                        onChangeText={handlePasswordConfirmChange}
                        placeholder="Confirmar palavra-passe"
                        secureTextEntry={showPassword ? false : true}
                        autoCapitalize='none'
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <Text style={{ color: 'white', marginRight: 20, marginBottom: 20 }}>Mostar palavra-passe</Text>
                            <Ionicons name={!showPassword ? "eye-off" : "eye"} size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                    {loading ? <ActivityIndicator size="large" color="white" />
                        :
                        <>
                            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                                <Text style={styles.buttonText}>Registar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={24} color={'white'} />
                                <Text style={styles.backButtonText}>Voltar</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8C756A'
    },
    halfContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 400,
        resizeMode: 'contain',
    },
    formContainer: {
        width: '80%',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#b9aaa3'
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 5
    },
    backButton: {
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10
    },
    googleButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    separator: {
        backgroundColor: 'white',
        height: 1,
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: '#8C756A',
        fontWeight: 'bold',
    },
    googleButtonText: {
        color: '#8C756A',
        fontWeight: 'bold',
        marginRight: 20,
    },
    googleIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});

export default RegisterScreen;
