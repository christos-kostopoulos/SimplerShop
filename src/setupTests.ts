import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './store/slices/cartSlice';
import productsReducer from './store/slices/productSlice';
import ordersReducer from './store/slices/ordersSlice';
import { ordersApi } from './services/ordersApi';

// Correctly mock the discountApi module
vi.mock('./services/discountApi');

// Import the mocked version after mocking
import { discountApi } from './services/discountApi';

// Create a root reducer that can handle SET_STATE action for testing
const createRootReducer = () => {
  const rootReducer = combineReducers({
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer,
    [discountApi.reducerPath]: discountApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  });

  return (state: any, action: any) => {
    // Handle SET_STATE action for testing
    if (action.type === 'SET_STATE') {
      return {
        ...state,
        ...action.payload,
      };
    }
    return rootReducer(state, action);
  };
};

// Create a function to get a fresh store for each test
export const getTestStore = () =>
  configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(discountApi.middleware).concat(ordersApi.middleware),
    devTools: false,
  });

// For backward compatibility
export const testStore = getTestStore();

export type TestStore = ReturnType<typeof getTestStore>;
export type TestState = ReturnType<typeof testStore.getState>;
