import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShoppingCart from './ShoppingCartItems';
import { CartItem } from '../../Models/CartItem';
import { useNavigation } from '@react-navigation/native';

const ShoppingCartScreen: React.FC = () => {
    const navigation = useNavigation()

    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, title: 'Item 1', price: 10.99, quantity: 2 },
        { id: 2, title: 'Item 2', price: 12.99, quantity: 1 },
    ]);

    // Define handles for cart actions
    const handleRemoveItem = (itemId: number) => {
        // Logic to remove item from cart
        // Update cartItems state accordingly
    };

    const handleAdjustQuantity = (itemId: number, action: 'increment' | 'decrement') => {
        // Logic to adjust item quantity
        // Update cartItems state accordingly
    };

    const handleEmptyCart = () => {
        // Logic to empty the cart
        // Update cartItems state accordingly
    };

    const handleCheckout = () => {
        // Logic to proceed to checkout
    };

    const handleGoBack = () => {
        navigation.goBack()
    };

    // Calculate total price of all items in cart
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Carrinho de compras</Text>
            </View>
            <ShoppingCart
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onAdjustQuantity={handleAdjustQuantity}
            />
            <View style={styles.total}>
                <Text style={styles.totalText}>Total: {totalPrice.toFixed(2)}€</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleEmptyCart} style={[styles.button, styles.emptyButton]}>
                    <Text style={styles.buttonText}>Esvaziar carrinho</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCheckout} style={[styles.button, styles.checkoutButton]}>
                    <Text style={styles.buttonText}>Pagar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        justifyContent: 'center'
    },
    backButton: {
        position: 'absolute',
        left: 0,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    total: {
        marginTop: 20,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 10,
        marginTop: 20,
    },
    button: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    emptyButton: {
        backgroundColor: 'darkgrey',
        marginRight: 10,
    },
    checkoutButton: {
        backgroundColor: 'green',
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ShoppingCartScreen;
