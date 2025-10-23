import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import QuantityStepper from '../../components/QuantityStepper';
import themeReducer from '../../store/themeSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      theme: themeReducer,
    },
  });
};

describe('QuantityStepper Component', () => {
  test('should render with initial quantity', () => {
    const store = createMockStore();
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <QuantityStepper quantity={5} onIncrement={onIncrement} onDecrement={onDecrement} />
      </Provider>
    );

    expect(getByText('5')).toBeTruthy();
  });

  test('should render quantity correctly', () => {
    const store = createMockStore();
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <QuantityStepper quantity={10} onIncrement={onIncrement} onDecrement={onDecrement} />
      </Provider>
    );

    expect(getByText('10')).toBeTruthy();
  });

  test('should handle different quantity values', () => {
    const store = createMockStore();
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <QuantityStepper quantity={1} onIncrement={onIncrement} onDecrement={onDecrement} min={1} />
      </Provider>
    );

    // Verify quantity displays correctly
    expect(getByText('1')).toBeTruthy();
  });
});
