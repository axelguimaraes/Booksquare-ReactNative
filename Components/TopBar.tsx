import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { listenForCartChanges } from '../Services/ShoppingCartService';
import { requireAccount } from '../Utils/requireAccount';
import IconButton from './ui/IconButton';
import { colors, radius, spacing } from './ui/theme';

interface TopBarProps {
  navigation: NavigationProp<any>;
}

// App bar of the main screens: search, app name and shopping cart.
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
    if (!requireAccount()) return
    navigation.navigate('ShoppingCartScreen', undefined, { pop: true })
  }

  return (
    <View style={styles.appBar}>
      <Pressable
        style={({ pressed }) => [styles.searchField, pressed && styles.pressed]}
        onPress={() => navigation.navigate('Search')}
        accessibilityRole="search"
        accessibilityLabel="Pesquisar livros"
      >
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.searchPlaceholder} numberOfLines={1}>Pesquisar</Text>
      </Pressable>
      <Text style={styles.appBarTitle} accessibilityRole="header" numberOfLines={1}>BookSquare</Text>
      <IconButton
        icon="cart-outline"
        size={30}
        color={colors.onPrimary}
        badge={shoppingCartCount}
        onPress={navigateToShoppingCart}
        accessibilityLabel={shoppingCartCount > 0 ? `Carrinho de compras, ${shoppingCartCount} ${shoppingCartCount === 1 ? 'item' : 'itens'}` : 'Carrinho de compras'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    elevation: 4,
  },
  searchField: {
    flex: 1,
    maxWidth: 170,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  searchPlaceholder: {
    color: colors.textSecondary,
    fontSize: 15,
    marginLeft: spacing.xs,
    flexShrink: 1,
  },
  appBarTitle: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
});

export default TopBar;
