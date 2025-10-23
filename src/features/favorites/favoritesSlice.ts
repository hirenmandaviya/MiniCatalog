import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../store';

const FAVORITES_KEY = '@favorites';

interface FavoritesState {
  productIds: string[];
}

const initialState: FavoritesState = {
  productIds: [],
};

// Async thunks
export const loadFavorites = createAsyncThunk('favorites/loadFavorites', async () => {
  try {
    const favoritesData = await AsyncStorage.getItem(FAVORITES_KEY);
    if (favoritesData) {
      return JSON.parse(favoritesData) as string[];
    }
    return [];
  } catch {
    return [];
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.productIds.indexOf(productId);
      
      if (index > -1) {
        state.productIds.splice(index, 1);
      } else {
        state.productIds.push(productId);
      }
      
      // Save to AsyncStorage
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state.productIds));
    },
    clearFavorites: (state) => {
      state.productIds = [];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFavorites.fulfilled, (state, action) => {
      state.productIds = action.payload;
    });
  },
});

// Selectors
export const selectFavoriteIds = (state: RootState) => state.favorites.productIds;

export const selectIsFavorite = (state: RootState, productId: string) => {
  return state.favorites.productIds.includes(productId);
};

export const selectFavoriteProducts = (state: RootState) => {
  const favoriteIds = state.favorites.productIds;
  return state.products.items.filter(product => favoriteIds.includes(product.id));
};

export const selectFavoritesCount = (state: RootState) => state.favorites.productIds.length;

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

