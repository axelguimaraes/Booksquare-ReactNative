import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../config/firebase';


interface BottomBarProps {
  navigation: NavigationProp<any>; // Adjust the type according to your navigation stack
}

const BottomBar: React.FC<BottomBarProps> = ({ navigation }) => {

  const navigateToHomeScreen = () => {
    navigation.navigate('Home');
  };
  const navigateToNotificationsScreen = () => {
    navigation.navigate('Notifications');
  };
  const navigateToSellScreen = () => {
    if (FIREBASE_AUTH.currentUser.isAnonymous) {
      alert('Inicie sessão com uma conta para benificiar de todas as funcionalidades.')
      return
    }
    navigation.navigate('Sell');
  };
  const navigateToMessagesScreen = () => {
    if (FIREBASE_AUTH.currentUser.isAnonymous) {
      alert('Inicie sessão com uma conta para benificiar de todas as funcionalidades.')
      return
    }
    navigation.navigate('Messages');
  };
  const navigateToProfileScreen = () => {
    navigation.navigate('Profile');
  };


  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.iconButton} onPress={navigateToHomeScreen}>
        <Ionicons name="home-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={navigateToNotificationsScreen}>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={navigateToSellScreen}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={navigateToMessagesScreen}>
        <Ionicons name="mail-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={navigateToProfileScreen}>
        <Ionicons name="person-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    height: 56, // Android recommended height for bottom navigation bar
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1, // Add a border to separate from content
    borderTopColor: '#DADADA',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
});

export default BottomBar;
