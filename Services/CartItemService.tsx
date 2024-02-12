import { CartItem } from '../Models/CartItem';
import CartItems from '../DummyData/CartItems';

class CartItemService {
  private cartItems: CartItem[];

  constructor() {
    //this.cartItems = [];
    this.cartItems = CartItems
  }

  // Create a new cart item
  createCartItem(newCartItem: CartItem): void {
    this.cartItems.push(newCartItem);
  }

  // Read all cart items
  getAllCartItems(): CartItem[] {
    return this.cartItems;
  }

  // Read a specific cart item by its ID
  getCartItemById(itemId: number): CartItem | undefined {
    return this.cartItems.find(item => item.id === itemId);
  }

  // Update an existing cart item
  updateCartItem(updatedCartItem: CartItem): void {
    const index = this.cartItems.findIndex(item => item.id === updatedCartItem.id);
    if (index !== -1) {
      this.cartItems[index] = updatedCartItem;
    }
  }

  // Delete a cart item by its ID
  deleteCartItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  // Empty the cart
  emptyCart(): void {
    this.cartItems = [];
  }
}

export default CartItemService;
