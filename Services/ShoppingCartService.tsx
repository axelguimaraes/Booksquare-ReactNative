import { collection, addDoc, getDocs, query, where, updateDoc, onSnapshot, runTransaction } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/firebase';
import { ShoppingCart, ShoppingCartItem } from '../Models/ShoppingCart';
import { Book } from '../Models/Book';
import uuid from 'react-native-uuid';

export const addToCart = async (userId: string, book: Book): Promise<void> => {
    console.log('Adding to cart')
    try {
        const item: ShoppingCartItem = {
            productId: uuid.v4().toString(), 
            price: book.price,
            name: book.title,
            isbn: book.isbn
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
    console.log('Removing from cart')
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
    console.log('Clearing cart')
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
    console.log('Getting cart items')
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

export const getCartItemCount = async (userId: string): Promise<number> => {
    console.log('Getting cart item count')
    try {
        const cartCollection = collection(FIREBASE_DB, 'shoppingCarts');
        const cartQuery = query(cartCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(cartQuery);

        if (!querySnapshot.empty) {
            const cartData = querySnapshot.docs[0].data();
            const items: ShoppingCartItem[] = cartData.items || [];
            return items.length;
        }

        return 0; // Return 0 if cart is empty
    } catch (error) {
        console.error('Error fetching cart item count:', error);
        throw error;
    }
};

export const listenForCartChanges = (updateCallback) => {
    console.log('Listening for cart changes')
    const currentUser = FIREBASE_AUTH.currentUser
    const cartCollection = collection(FIREBASE_DB, 'shoppingCarts');
    const cartQuery = query(cartCollection, where('userId', '==', currentUser.uid));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(cartQuery, async (snapshot) => {
      // Fetch updated cart item count
      const count = await getCartItemCount(currentUser.uid);
      updateCallback(count);
    });
  
    // Return the unsubscribe function to stop listening
    return unsubscribe;
  };

  export const purchaseItems = async (cartItems: ShoppingCartItem[]) => {
    console.log('Purchasing items...');

    const db = FIREBASE_DB;
    const booksCollection = collection(db, 'books');
    const userId = FIREBASE_AUTH.currentUser.uid
    const currentOwner = FIREBASE_AUTH.currentUser.displayName

    try {
        await Promise.all(cartItems.map(async (cartItem) => {
            const { isbn } = cartItem;
            const bookQuerySnapshot = await getDocs(query(booksCollection, where('isbn', '==', isbn)));
            if (!bookQuerySnapshot.empty) {
                const bookDoc = bookQuerySnapshot.docs[0];
                await runTransaction(db, async (transaction) => {
                    const bookRef = bookDoc.ref;
                    const bookSnap = await transaction.get(bookRef);
                    if (bookSnap.exists()) {
                        const bookData: Book = bookSnap.data() as Book;
                        if (bookData.isVisible && bookData.currentOwner !== userId) {
                            transaction.update(bookRef, {
                                isVisible: false,
                                currentOwner: currentOwner,
                            });
                            await clearCart(userId)
                        }
                    }
                });
            }
        }));
        console.log('Items purchased successfully.');
    } catch (error) {
        console.error('Error purchasing items:', error);
        throw error;
    }
};