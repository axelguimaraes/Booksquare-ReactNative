export interface ShoppingCartItem {
    productId: string;
    name: string
    price: number
    isbn: number
}

export interface ShoppingCart {
    userId: string
    items: ShoppingCartItem[]
  }