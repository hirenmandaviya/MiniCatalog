import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../store';
import { CartState } from './types';
import { Product } from '../products/types';

const CART_KEY = '@cart_items';

const initialState: CartState = {
  items: [],
  promoCode: null,
  discount: 0,
};

// Promo codes
const PROMO_CODES: Record<string, number> = {
  'SAVE10': 0.10,
  'SAVE20': 0.20,
  'WELCOME': 0.15,
  'DISCOUNT5': 0.05,
};

// Async thunks
export const loadCart = createAsyncThunk('cart/loadCart', async () => {
  try {
    const cartData = await AsyncStorage.getItem(CART_KEY);
    if (cartData) {
      return JSON.parse(cartData) as CartState;
    }
    return initialState;
  } catch {
    return initialState;
  }
});

export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (state: CartState) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      
      // Save to AsyncStorage
      AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(cartItem => cartItem.product.id === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.discount = 0;
      AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
    },
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase();
      if (PROMO_CODES[code]) {
        state.promoCode = code;
        state.discount = PROMO_CODES[code];
        AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
      }
    },
    removePromoCode: (state) => {
      state.promoCode = null;
      state.discount = 0;
      AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartItemsCount = (state: RootState) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const selectCartDiscount = (state: RootState) => state.cart.discount;
export const selectPromoCode = (state: RootState) => state.cart.promoCode;

export const selectCartTotal = (state: RootState) => {
  const subtotal = selectCartSubtotal(state);
  const discount = state.cart.discount;
  return subtotal * (1 - discount);
};

export const selectIsInCart = (state: RootState, productId: string) => {
  return state.cart.items.some(item => item.product.id === productId);
};

export const selectCartItemQuantity = (state: RootState, productId: string) => {
  const cartItem = state.cart.items.find(item => item.product.id === productId);
  return cartItem?.quantity || 0;
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromoCode,
  removePromoCode,
} = cartSlice.actions;

export default cartSlice.reducer;

