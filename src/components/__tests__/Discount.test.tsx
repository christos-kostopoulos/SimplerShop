import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { Product } from '../../models/Product';
import Discount from '../Discount';
import { testStore } from '../../setupTests';

describe('Discount Component', () => {
  const mockProduct: Product = {
    id: 'testtt-adsdtest',
    name: 'Test Product',
    price: 19.99,
    stock: 5,
  };

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

  it('renders the Discount Component without any discount', () => {
    const store = testStore;
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );
    const discountInput = screen.getByTestId('discount-input');
    expect(discountInput).toHaveValue('');
  });

  it('applies a valid discount code', async () => {
    const store = testStore;
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const discountInput = screen.getByTestId('discount-input');
    const applyButton = screen.getByRole('button', { name: /apply/i });

    // Simulate entering a valid discount code
    fireEvent.change(discountInput, { target: { value: 'SUMMER20' } });
    fireEvent.click(applyButton);

    // Wait for the discount to be applied
    await waitFor(() => {
      expect(screen.getByText(/SUMMER20/)).toBeInTheDocument();
    });
  });

  it('shows error for invalid discount code', async () => {
    const store = testStore;
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const discountInput = screen.getByTestId('discount-input');
    const applyButton = screen.getByRole('button', { name: /apply/i });

    // Simulate entering an invalid discount code
    fireEvent.change(discountInput, { target: { value: 'INVALID' } });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid discount code/)).toBeInTheDocument();
    });
  });

  it('shows error when no discount code is entered', async () => {
    const store = testStore;
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const applyButton = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a discount code/)).toBeInTheDocument();
    });
  });

  it('clears an applied discount', async () => {
    const store = testStore;
    store.dispatch({
      type: 'SET_STATE',
      payload: {
        ...preloadedState,
        cart: {
          ...preloadedState.cart,
          discount: {
            code: 'SUMMER20',
            type: 'PERCENTAGE',
            amount: 20,
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const removeButton = screen.getByText(/Remove/);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByTestId('discount-input')).toBeInTheDocument();
    });
  });
});
