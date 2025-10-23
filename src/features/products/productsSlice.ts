import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../store';
import { ProductsState } from './types';
import { fetchProducts as fetchProductsAPI } from '../../api/products';

const CACHE_KEY = '@products_cache';

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  priceRange: [0, 500],
  cachedAt: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchProductsAPI();
      // Cache products
      const cacheData = {
        products,
        cachedAt: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      return { products, cachedAt: Date.now() };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const loadCachedProducts = createAsyncThunk(
  'products/loadCachedProducts',
  async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { products, cachedAt } = JSON.parse(cached);
        return { products, cachedAt };
      }
      return { products: [], cachedAt: null };
    } catch {
      return { products: [], cachedAt: null };
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.priceRange = [0, 500];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.cachedAt = action.payload.cachedAt;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load cached products
      .addCase(loadCachedProducts.fulfilled, (state, action) => {
        if (action.payload.products.length > 0) {
          state.items = action.payload.products;
          state.cachedAt = action.payload.cachedAt;
        }
      });
  },
});

// Selectors
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSearchQuery = (state: RootState) => state.products.searchQuery;
export const selectSelectedCategory = (state: RootState) => state.products.selectedCategory;
export const selectPriceRange = (state: RootState) => state.products.priceRange;

export const selectFilteredProducts = (state: RootState) => {
  const { items, searchQuery, selectedCategory, priceRange } = state.products;
  
  return items.filter(product => {
    // Search filter
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    // Price range filter
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
};

export const selectCategories = (state: RootState) => {
  const categories = state.products.items.map(p => p.category);
  return Array.from(new Set(categories));
};

export const selectProductById = (state: RootState, productId: string) => {
  return state.products.items.find(p => p.id === productId);
};

export const { setSearchQuery, setSelectedCategory, setPriceRange, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;

