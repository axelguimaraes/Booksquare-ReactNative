import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../config/firebase';
import { ShoppingCartItem } from '../Models/ShoppingCart';
import { Book } from '../Models/Book';
import uuid from 'react-native-uuid';

export const addToCart = async (userId: string, book: Book): Promise<void> => {
    try {
        const item: ShoppingCartItem = {
            productId: uuid.v4().toString(), 
            price: book.price 
        };

        const cartCollection = collection(FIREBASE_DB, 'shoppingCarts');
        const cartQuery = query(cartCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(cartQuery);

        if (querySnapshot.empty) {
            // If the shopping cart doesn't exist for the user, create a new one
            const cartRef = await addDoc(cartCollection, { userId, items: [item] });
            item.productId = cartRef.id; // Set the productId to the Firestore document ID of the shopping cart
        } else {
            // If the shopping cart already exists, update it with the new item
            const cartDocRef = querySnapshot.docs[0].ref;
            const cartData = querySnapshot.docs[0].data();
            const updatedItems = [...cartData.items, item];
            await updateDoc(cartDocRef, { items: updatedItems });
        }
        alert('Item adicionado ao carrinho!')
    } catch (error) {
        console.error('Error adding item to shopping cart:', error);
        throw error;
    }
};

export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
    try {
        const cartCollection = collection(FIREBASE_DB, 'shoppingCarts');
        const cartQuery = query(cartCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(cartQuery);

        if (!querySnapshot.empty) {
            const cartDocRef = querySnapshot.docs[0].ref;
            const cartData = querySnapshot.docs[0].data();
            const updatedItems = cartData.items.filter((item: ShoppingCartItem) => item.productId !== productId);
            await updateDoc(cartDocRef, { items: updatedItems })
        }
    } catch (error) {
        console.error('Error removing item from shopping cart:', error);
        throw error;
    }
};

export const clearCart = async (userId: string): Promise<void> => {
    try {
        const cartCollection = collection(FIREBASE_DB, 'shoppingCarts');
        const cartQuery = query(cartCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(cartQuery);

        if (!querySnapshot.empty) {
            const cartDocRef = querySnapshot.docs[0].ref;
            await updateDoc(cartDocRef, { items: [] })
        }
    } catch (error) {
        console.error('Error clearing shopping cart:', error);
        throw error;
    }
};

export const getCartItems = async (userId: string): Promise<ShoppingCartItem[]> => {
    try {
        const cartCollection = collection(FIREBASE_DB, 'shoppingCarts');
        const cartQuery = query(cartCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(cartQuery);

        if (!querySnapshot.empty) {
            const cartData = querySnapshot.docs[0].data();
            return cartData.items || [];
        }

        return [];
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};