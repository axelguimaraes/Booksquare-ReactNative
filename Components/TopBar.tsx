import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { listenForCartChanges } from '../Services/ShoppingCartService';
import IconBadge from 'react-native-icon-badge';
import { FIREBASE_AUTH } from '../config/firebase';

interface TopBarProps {
  navigation: NavigationProp<any>;
}

const TopBar: React.FC<TopBarProps> = ({ navigation }) => {
  const [shoppingCartCount, setShoppingCartCount] = useState(0)

  useEffect(() => {
    // Set up listener for real-time updates to the shopping cart count
    const unsubscribe = listenForCartChanges((count) => {
      setShoppingCartCount(count);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const navigateToShoppingCart = () => {
    if (FIREBASE_AUTH.currentUser.isAnonymous) {
      alert('Inicie sessão com uma conta para benificiar de todas as funcionalidades.')
      return
    }
    navigation.navigate('ShoppingCartScreen')
  }

  return (
    <View style={styles.appBar}>
      <View style={styles.appBarLeft}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          placeholderTextColor="#ccc"
          editable={false}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.appBarTitle}>BookSquare</Text>
      <TouchableOpacity style={styles.cartIcon} onPress={navigateToShoppingCart}>
        <IconBadge
          MainElement={<Ionicons name="cart-outline" size={35} color="white" />}
          BadgeElement={<Text style={styles.badgeText}>{shoppingCartCount}</Text>}
          IconBadgeStyle={styles.iconBadge}
          Hidden={shoppingCartCount === 0}
        />
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
    elevation: 4,
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
    top: 5,
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartIcon: {
    padding: 5,
  },
  iconBadge: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 15,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11
  },
});

export default TopBar;
