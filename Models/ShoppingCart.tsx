export interface ShoppingCartItem {
    productId: string;
    name: string
    price: number
}

export interface ShoppingCart {
    userId: string
    items: ShoppingCartItem[]
  }