import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH

    const handleEmailChange = (text) => setEmail(text);
    const handleUsernameChange = (text) => setUsername(text)
    const handlePasswordChange = (text) => setPassword(text);
    const handlePasswordConfirmChange = (text) => setPasswordConfirm(text);

    const handleRegister = async () => {
        setLoading(true)
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            console.log(response)
        } catch (error: any) {
            console.log(error)
            alert('Register failed: ' + error.message)
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
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={handlePasswordChange}
                        placeholder="Palavra-passe"
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        value={passwordConfirm}
                        onChangeText={handlePasswordConfirmChange}
                        placeholder="Confirmar palavra-passe"
                        secureTextEntry={true}
                    />
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
