import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../../components/ProductCard';
import favoritesReducer from '../../features/favorites/favoritesSlice';
import themeReducer from '../../store/themeSlice';
import { Product } from '../../features/products/types';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockProduct: Product = {
  id: 'p-1001',
  title: 'Test Product',
  price: 199.99,
  rating: 4.5,
  category: 'test',
  thumbnail: 'https://example.com/image.jpg',
  images: ['https://example.com/image1.jpg'],
  description: 'Test description',
};

const createMockStore = () => {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
      theme: themeReducer,
    },
  });
};

describe('ProductCard Component', () => {
  test('should render product information correctly', () => {
    const store = createMockStore();
    const onPress = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <ProductCard product={mockProduct} onPress={onPress} />
      </Provider>
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('test')).toBeTruthy();
  });

  test('should call onPress when card is pressed', () => {
    const store = createMockStore();
    const onPress = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <ProductCard product={mockProduct} onPress={onPress} />
      </Provider>
    );

    fireEvent.press(getByText('Test Product'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
