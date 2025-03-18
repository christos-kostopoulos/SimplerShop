import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './store/slices/cartSlice';
import productsReducer from './store/slices/productSlice';
import ordersReducer from './store/slices/ordersSlice';
import { discountApi } from './services/discountApi';
import { ordersApi } from './services/ordersApi';

export const testStore = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer,
    [discountApi.reducerPath]: discountApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(discountApi.middleware).concat(ordersApi.middleware),
});

export type TestStore = typeof testStore;
export type TestState = ReturnType<typeof testStore.getState>;
