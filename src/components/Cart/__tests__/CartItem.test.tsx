import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CartItem from '../CartItem';
import cartReducer, { removeFromCart, updateQuantity } from '../../../store/slices/cartSlice';
import productReducer from '../../../store/slices/productSlice';
import { Product } from '../../../models/Product';

const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      products: productReducer,
    },
    preloadedState,
  });
};

describe('CartItem Component', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 19.99,
    stock: 10,
  };

  // Setup initial store state
  const preloadedState = {
    products: {
      ids: ['1'],
      entities: {
        '1': mockProduct,
      },
      status: 'fulfilled',
      error: null,
    },
    cart: {
      cartId: 'test-cart-id',
      items: [{ productId: '1', quantity: 2 }],
      discount: null,
      status: 'idle',
      error: null,
    },
  };

  it('renders the cart item with product information', () => {
    const store = createMockStore(preloadedState);

    render(
      <Provider store={store}>
        <CartItem productId="1" quantity={2} />
      </Provider>
    );

    // Check if product name is displayed
    expect(screen.getByText('Test Product')).toBeInTheDocument();

    // Check if price information is shown
    expect(screen.getByText('$19.99 each')).toBeInTheDocument();

    // Check if total price is calculated correctly (19.99 * 2)
    expect(screen.getByText('$39.98')).toBeInTheDocument();

    // Check if quantity is displayed
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('dispatches updateQuantity action when increasing quantity', () => {
    const store = createMockStore(preloadedState);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <CartItem productId="1" quantity={2} />
      </Provider>
    );

    // Find and click the increase quantity button
    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    // Check if updateQuantity action was dispatched with correct arguments
    expect(dispatchSpy).toHaveBeenCalledWith(updateQuantity({ productId: '1', quantity: 3 }));
  });

  it('dispatches updateQuantity action when decreasing quantity', () => {
    const store = createMockStore(preloadedState);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <CartItem productId="1" quantity={2} />
      </Provider>
    );

    // Find and click the decrease quantity button
    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    // Check if updateQuantity action was dispatched with correct arguments
    expect(dispatchSpy).toHaveBeenCalledWith(updateQuantity({ productId: '1', quantity: 1 }));
  });

  it('disables decrease button when quantity is 1', () => {
    const singleItemState = {
      ...preloadedState,
      cart: {
        ...preloadedState.cart,
        items: [{ productId: '1', quantity: 1 }],
      },
    };

    const store = createMockStore(singleItemState);

    render(
      <Provider store={store}>
        <CartItem productId="1" quantity={1} />
      </Provider>
    );

    // Check if decrease button is disabled
    const decreaseButton = screen.getByText('-');
    expect(decreaseButton).toBeDisabled();
  });

  it('disables increase button when quantity equals stock', () => {
    const maxStockState = {
      ...preloadedState,
      cart: {
        ...preloadedState.cart,
        items: [{ productId: '1', quantity: 10 }], // max stock is 10
      },
    };

    const store = createMockStore(maxStockState);

    render(
      <Provider store={store}>
        <CartItem productId="1" quantity={10} />
      </Provider>
    );

    // Check if increase button is disabled
    const increaseButton = screen.getByText('+');
    expect(increaseButton).toBeDisabled();
  });

  it('dispatches removeFromCart action when remove button is clicked', () => {
    const store = createMockStore(preloadedState);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <CartItem productId="1" quantity={2} />
      </Provider>
    );

    // Find and click the remove button (the trash icon)
    const removeButton = screen.getByTestId('remove-button');
    fireEvent.click(removeButton);

    // Check if removeFromCart action was dispatched with correct product ID
    expect(dispatchSpy).toHaveBeenCalledWith(removeFromCart('1'));
  });
});
