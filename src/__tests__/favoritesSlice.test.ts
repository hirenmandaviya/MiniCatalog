import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer, {
  toggleFavorite,
  clearFavorites,
  selectFavoriteIds,
  selectIsFavorite,
} from '../features/favorites/favoritesSlice';

describe('Favorites Slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
  });

  test('should add product to favorites', () => {
    store.dispatch(toggleFavorite('p-1001'));
    const state = store.getState();
    const favoriteIds = selectFavoriteIds(state);
    
    expect(favoriteIds).toHaveLength(1);
    expect(favoriteIds[0]).toBe('p-1001');
  });

  test('should remove product from favorites', () => {
    store.dispatch(toggleFavorite('p-1001'));
    store.dispatch(toggleFavorite('p-1001'));
    const state = store.getState();
    const favoriteIds = selectFavoriteIds(state);
    
    expect(favoriteIds).toHaveLength(0);
  });

  test('should check if product is favorite', () => {
    store.dispatch(toggleFavorite('p-1001'));
    const state = store.getState();
    const isFavorite = selectIsFavorite(state, 'p-1001');
    
    expect(isFavorite).toBe(true);
  });

  test('should clear all favorites', () => {
    store.dispatch(toggleFavorite('p-1001'));
    store.dispatch(toggleFavorite('p-1002'));
    store.dispatch(clearFavorites());
    const state = store.getState();
    const favoriteIds = selectFavoriteIds(state);
    
    expect(favoriteIds).toHaveLength(0);
  });
});

