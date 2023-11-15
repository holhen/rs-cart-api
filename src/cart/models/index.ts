import { Cart, CartItem } from '@prisma/client';

export interface CartWithCartItem extends Cart {
  cart_item: CartItem[];
}
