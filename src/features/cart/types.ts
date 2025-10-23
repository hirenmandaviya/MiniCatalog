import { Product } from '../products/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
}

