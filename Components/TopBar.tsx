import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface TopBarProps {
  navigation: NavigationProp<any>;
}

const TopBar: React.FC<TopBarProps> = ({navigation}) => {

  const navigateToShoppingCart = () => {
    navigation.navigate('ShoppingCartScreen')
  }

  return (
    <View style={styles.appBar}>
      <View style={styles.appBarLeft}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.appBarTitle}>BookSquare</Text>
      <TouchableOpacity style={styles.cartIcon} onPress={navigateToShoppingCart}>
        <Ionicons name="cart-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    appBar: {
      backgroundColor: '#8C756A',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      paddingHorizontal: 10,
      elevation: 4, // Android specific elevation for shadow
    },
    appBarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      width: 150,
      marginRight: 10,
    },
    searchButton: {
      position: 'absolute',
      right: 20,
      top: 5, // Adjust position to center the icon vertically
    },
    appBarTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    cartIcon: {
      padding: 5,
    },
  });

export default TopBar;
