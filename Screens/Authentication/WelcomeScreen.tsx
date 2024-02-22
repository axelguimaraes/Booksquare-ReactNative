import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { loginAnonymously } from '../../Services/AuthService';

interface LoginScreenProps {
  navigation: any; // Adjust the type according to your navigation prop type
}

const WelcomeScreen: React.FC<LoginScreenProps> = ({ navigation }) => {

  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    navigation.navigate('LoginScreen')
  }

  const handleEnterAsGuest = async () => {
    setLoading(true)
    try {
      loginAnonymously()
    } finally {
      setLoading(false)
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen')
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        {/* Your logo component goes here */}
        <Image source={require('../../assets/BookSquare_final.png') as ImageSourcePropType} style={styles.logo} />
      </View>

      {/* Login Buttons */}
      {loading ? <ActivityIndicator size="large" color="white" />
        :
        <>
          <View style={styles.loginContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleEnterAsGuest}>
              <Text style={styles.buttonText}>Entrar como convidado</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerText}>Não tem uma conta? Registe-se</Text>
            </TouchableOpacity>
          </View>
        </>
      }
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
  logoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 400,
    resizeMode: 'contain',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginBottom: 20,
    width: 300,
    elevation: 5
  },
  buttonText: {
    color: '#8C756A',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  registerText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
});

export default WelcomeScreen;
