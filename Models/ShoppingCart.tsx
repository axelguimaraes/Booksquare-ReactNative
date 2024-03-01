export interface ShoppingCartItem {
    productId: string;
    price: number
}

export interface ShoppingCart {
    userId: string
    items: ShoppingCartItem[]
  }