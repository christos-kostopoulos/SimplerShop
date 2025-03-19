import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './store/slices/cartSlice';
import productsReducer from './store/slices/productSlice';
import ordersReducer from './store/slices/ordersSlice';
import { ordersApi } from './services/ordersApi';

// Correctly mock the discountApi module
vi.mock('./services/discountApi');

// Import the mocked version after mocking
import { discountApi } from './services/discountApi';

// Create a function to get a fresh store for each test
export const getTestStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      products: productsReducer,
      orders: ordersReducer,
      [discountApi.reducerPath]: discountApi.reducer,
      [ordersApi.reducerPath]: ordersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(discountApi.middleware).concat(ordersApi.middleware),
    // Add a custom action to set state for testing
    devTools: false,
  });

// For backward compatibility
export const testStore = getTestStore();

export type TestStore = ReturnType<typeof getTestStore>;
export type TestState = ReturnType<typeof testStore.getState>;
