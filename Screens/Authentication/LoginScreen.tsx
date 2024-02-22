import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginWithEmailAndPassword } from '../../Services/AuthService';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const handleEmailChange = (text) => setEmail(text);
    const handlePasswordChange = (text) => setPassword(text);

    const handleEmailLogin = async () => {
        setLoading(true)
        try {
            loginWithEmailAndPassword(email, password)
        } finally {
            setLoading(false)
        }
    };

    const handleGoogleLogin = () => {
        // Perform Google login logic here
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
                        value={password}
                        onChangeText={handlePasswordChange}
                        placeholder="Palavra-passe"
                        secureTextEntry={true}
                    />
                    {loading ? <ActivityIndicator size="large" color="white" />
                        :
                        <>
                            <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
                                <Text style={styles.buttonText}>Entrar com Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={24} color={'white'} />
                                <Text style={styles.backButtonText}>Voltar</Text>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                                <Text style={styles.googleButtonText}>Entrar com Google</Text>
                                <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
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
        elevation: 5
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

export default LoginScreen;
