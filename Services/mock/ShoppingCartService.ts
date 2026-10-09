import uuid from 'react-native-uuid';
import { ShoppingCart, ShoppingCartItem } from '../../Models/ShoppingCart';
import { Book } from '../../Models/Book';
import { getCurrentUser } from '../AuthService';
import { purchaseBook } from '../BooksService';
import { mockStore } from './mockStore';

const itemsOf = (carts: ShoppingCart[], userId: string): ShoppingCartItem[] =>
    carts.find((cart) => cart.userId === userId)?.items ?? [];

const setItems = (userId: string, update: (items: ShoppingCartItem[]) => ShoppingCartItem[]) =>
    mockStore.write('shoppingCarts', (carts) => {
        const items = update(itemsOf(carts, userId));
        return carts.some((cart) => cart.userId === userId)
            ? carts.map((cart) => (cart.userId === userId ? { ...cart, items } : cart))
            : [...carts, { userId, items }];
    });

export const addToCart = async (userId: string, book: Book): Promise<void> => {
    try {
        const item: ShoppingCartItem = {
            productId: uuid.v4().toString(),
            price: book.price,
            name: book.title,
            isbn: book.isbn
        };

        let alreadyInCart = false;
        await setItems(userId, (items) => {
            alreadyInCart = items.some((existing) => existing.isbn === book.isbn);
            return alreadyInCart ? items : [...items, item];
        });
        alert(alreadyInCart ? 'Este livro já se encontra no carrinho de compras!' : 'Item adicionado ao carrinho!');
    } catch (error) {
        console.error('Error adding item to shopping cart:', error);
        throw error;
    }
};

export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
    await setItems(userId, (items) => items.filter((item) => item.productId !== productId));
};

export const clearCart = async (userId: string): Promise<void> => {
    await setItems(userId, () => []);
};

export const getCartItems = async (userId: string): Promise<ShoppingCartItem[]> => {
    return itemsOf(await mockStore.read('shoppingCarts'), userId);
};

export const getCartItemCount = async (userId: string): Promise<number> => {
    return (await getCartItems(userId)).length;
};

export const listenForCartChanges = (updateCallback) => {
    const userId = getCurrentUser().uid;
    return mockStore.subscribe('shoppingCarts', (carts) => updateCallback(itemsOf(carts, userId).length));
};

export const purchaseItems = async (cartItems: ShoppingCartItem[]) => {
    const userId = getCurrentUser().uid;
    const currentOwner = getCurrentUser().displayName;

    try {
        await Promise.all(cartItems.map((cartItem) =>
            purchaseBook({ isbn: cartItem.isbn, buyerId: userId, buyerName: currentOwner })
        ));
        await clearCart(userId);
    } catch (error) {
        console.error('Error purchasing items:', error);
        throw error;
    }
};
