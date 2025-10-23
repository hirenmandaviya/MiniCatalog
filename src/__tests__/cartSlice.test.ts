import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotal,
  selectCartDiscount,
} from '../features/cart/cartSlice';
import { Product } from '../features/products/types';

const mockProduct: Product = {
  id: 'p-1001',
  title: 'Test Product',
  price: 100,
  rating: 4.5,
  category: 'test',
  thumbnail: 'https://example.com/image.jpg',
  images: ['https://example.com/image1.jpg'],
  description: 'Test description',
};

describe('Cart Slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  test('should add item to cart', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));
    const state = store.getState();
    const items = selectCartItems(state);
    
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe('p-1001');
    expect(items[0].quantity).toBe(2);
  });

  test('should update quantity when adding existing item', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
    store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));
    const state = store.getState();
    const items = selectCartItems(state);
    
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  test('should remove item from cart', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
    store.dispatch(removeFromCart('p-1001'));
    const state = store.getState();
    const items = selectCartItems(state);
    
    expect(items).toHaveLength(0);
  });

  test('should update item quantity', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
    store.dispatch(updateQuantity({ productId: 'p-1001', quantity: 5 }));
    const state = store.getState();
    const items = selectCartItems(state);
    
    expect(items[0].quantity).toBe(5);
  });

  test('should clear cart', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
    store.dispatch(clearCart());
    const state = store.getState();
    const items = selectCartItems(state);
    
    expect(items).toHaveLength(0);
  });

  test('should calculate correct subtotal', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 2 }));
    const state = store.getState();
    const subtotal = selectCartSubtotal(state);
    
    expect(subtotal).toBe(200);
  });

  test('should apply promo code', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
    store.dispatch(applyPromoCode('SAVE10'));
    const state = store.getState();
    const discount = selectCartDiscount(state);
    
    expect(discount).toBe(0.10);
  });

  test('should calculate correct total with discount', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
    store.dispatch(applyPromoCode('SAVE10'));
    const state = store.getState();
    const total = selectCartTotal(state);
    
    expect(total).toBe(90);
  });

  test('should remove promo code', () => {
    store.dispatch(addToCart({ product: mockProduct, quantity: 1 }));
    store.dispatch(applyPromoCode('SAVE10'));
    store.dispatch(removePromoCode());
    const state = store.getState();
    const discount = selectCartDiscount(state);
    
    expect(discount).toBe(0);
  });
});

