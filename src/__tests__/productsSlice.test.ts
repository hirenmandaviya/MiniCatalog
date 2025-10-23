import { configureStore } from '@reduxjs/toolkit';
import productsReducer, {
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  clearFilters,
  selectSearchQuery,
  selectSelectedCategory,
  selectPriceRange,
  selectFilteredProducts,
} from '../features/products/productsSlice';
import { Product } from '../features/products/types';

const mockProducts: Product[] = [
  {
    id: 'p-1001',
    title: 'Wireless Headphones',
    price: 199.99,
    rating: 4.4,
    category: 'audio',
    thumbnail: 'https://example.com/1.jpg',
    images: ['https://example.com/1a.jpg'],
    description: 'Great headphones',
  },
  {
    id: 'p-1002',
    title: 'Gaming Mouse',
    price: 79.99,
    rating: 4.8,
    category: 'gaming',
    thumbnail: 'https://example.com/2.jpg',
    images: ['https://example.com/2a.jpg'],
    description: 'Best gaming mouse',
  },
];

describe('Products Slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
      },
      preloadedState: {
        products: {
          items: mockProducts,
          loading: false,
          error: null,
          searchQuery: '',
          selectedCategory: null,
          priceRange: [0, 500] as [number, number],
          cachedAt: null,
        },
      },
    });
  });

  test('should set search query', () => {
    store.dispatch(setSearchQuery('headphones'));
    const state = store.getState();
    const query = selectSearchQuery(state);
    
    expect(query).toBe('headphones');
  });

  test('should set selected category', () => {
    store.dispatch(setSelectedCategory('audio'));
    const state = store.getState();
    const category = selectSelectedCategory(state);
    
    expect(category).toBe('audio');
  });

  test('should set price range', () => {
    store.dispatch(setPriceRange([50, 100]));
    const state = store.getState();
    const priceRange = selectPriceRange(state);
    
    expect(priceRange).toEqual([50, 100]);
  });

  test('should filter products by search query', () => {
    store.dispatch(setSearchQuery('headphones'));
    const state = store.getState();
    const filtered = selectFilteredProducts(state);
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('p-1001');
  });

  test('should filter products by category', () => {
    store.dispatch(setSelectedCategory('gaming'));
    const state = store.getState();
    const filtered = selectFilteredProducts(state);
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('p-1002');
  });

  test('should filter products by price range', () => {
    store.dispatch(setPriceRange([0, 100]));
    const state = store.getState();
    const filtered = selectFilteredProducts(state);
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('p-1002');
  });

  test('should clear all filters', () => {
    store.dispatch(setSearchQuery('test'));
    store.dispatch(setSelectedCategory('audio'));
    store.dispatch(setPriceRange([50, 100]));
    store.dispatch(clearFilters());
    
    const state = store.getState();
    const query = selectSearchQuery(state);
    const category = selectSelectedCategory(state);
    const priceRange = selectPriceRange(state);
    
    expect(query).toBe('');
    expect(category).toBeNull();
    expect(priceRange).toEqual([0, 500]);
  });
});

