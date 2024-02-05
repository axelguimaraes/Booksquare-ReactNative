import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShoppingCart from '../../Components/ShoppingCartItems';
import { CartItem } from '../../Models/CartItem';
import { useNavigation } from '@react-navigation/native';
import CartItemService from '../../Services/CartItemService';

const ShoppingCartScreen: React.FC = () => {
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const cartItemService = new CartItemService();

    useEffect(() => {
        // Load cart items when the component mounts
        loadCartItems();
    }, []);

    const loadCartItems = () => {
        setCartItems(cartItemService.getAllCartItems());
    };

    const handleRemoveItem = (itemId: number) => {
        // Delete item from cartItems state
        setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
        // Also delete item from CartItemService
        cartItemService.deleteCartItem(itemId);
    };    

    const handleAdjustQuantity = (itemId: number, action: 'increment' | 'decrement') => {
        // Logic to adjust item quantity
        // Update cartItems state accordingly
    };

    const handleEmptyCart = () => {
        cartItemService.emptyCart();
        setCartItems([]); // Clear cart items state
    };

    const handleCheckout = () => {
        // Logic to proceed to checkout
    };

    const handleGoBack = () => {
        navigation.goBack();
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
            {cartItems.length === 0 ? (
                <Text style={styles.noItemsText}>Nenhum item adicionado</Text>
            ) : (
                <>
                    <View style={styles.total}>
                        <Text style={styles.totalText}>Total: {totalPrice.toFixed(2)}€</Text>
                    </View>
                </>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleEmptyCart} style={[styles.button, styles.emptyButton]}>
                    <Text style={styles.buttonText}>Esvaziar carrinho</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleCheckout}
                    style={[styles.button, styles.checkoutButton, cartItems.length === 0 && styles.disabledButton]}
                    disabled={cartItems.length === 0}
                >
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
        justifyContent: 'center',
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
    noItemsText: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: 'red',
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
        backgroundColor: '#8C756A',
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    disabledButton: {
        backgroundColor: 'lightgrey',
    },
});

export default ShoppingCartScreen;
