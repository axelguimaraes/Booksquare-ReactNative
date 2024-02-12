import React from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem } from '../Models/CartItem';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  cartItems: CartItem[];
  onRemoveItem: (itemId: number) => void;
  onAdjustQuantity: (itemId: number, action: 'increment' | 'decrement') => void;
}

const ShoppingCartItems: React.FC<Props> = ({ cartItems, onRemoveItem, onAdjustQuantity }) => {
  const renderHeader = () => {
    return (
      <View style={[styles.itemContainer, styles.headerContainer]}>
        <Text style={[styles.itemText, styles.headerText]}>Qtd.</Text>
        <Text style={[styles.itemText, styles.headerText]}>Item</Text>
        <Text style={[styles.itemText, styles.headerText]}>Preço</Text>
        <View style={{ width: 80 }} />
      </View>
    );
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.quantity}</Text>
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={styles.itemText}>{item.price}€</Text>
        <TouchableOpacity onPress={() => onRemoveItem(item.id)} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    width: '100%'
  },
  headerContainer: {
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  headerText: {
    fontWeight: 'bold',
  },
  removeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ShoppingCartItems;
