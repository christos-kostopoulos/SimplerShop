import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { describe, expect, it, beforeEach } from 'vitest';
import { Product } from '../../models/Product';
import Discount from '../Discount';
import { getTestStore, TestStore } from '../../setupTests';

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

  // Use a fresh store for each test
  let store: TestStore;

  beforeEach(() => {
    // Get a fresh store for each test to avoid state leakage
    store = getTestStore();
  });

  it('renders the Discount Component without any discount', () => {
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
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const discountInput = screen.getByTestId('discount-input');
    const applyButton = screen.getByTestId('apply-button');

    // Simulate entering a valid discount code
    fireEvent.change(discountInput, { target: { value: 'PCT5' } });
    fireEvent.click(applyButton);

    // Wait for the discount to be applied with a longer timeout
    await waitFor(
      () => {
        expect(screen.getByText(/PCT5/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify the discount is correctly displayed
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });

  it('shows error for invalid discount code', async () => {
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const discountInput = screen.getByTestId('discount-input');
    const applyButton = screen.getByTestId('apply-button');

    // Simulate entering an invalid discount code
    fireEvent.change(discountInput, { target: { value: 'INVALID' } });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid discount code/)).toBeInTheDocument();
    });
  });

  it('shows error when no discount code is entered', async () => {
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const applyButton = screen.getByTestId('apply-button');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a discount code/)).toBeInTheDocument();
    });
  });

  it('clears an applied discount', async () => {
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <Discount />
      </Provider>
    );

    const discountInput = screen.getByTestId('discount-input');
    const applyButton = screen.getByTestId('apply-button');

    // Simulate entering a valid discount code
    fireEvent.change(discountInput, { target: { value: 'PCT5' } });
    fireEvent.click(applyButton);

    // Wait for the discount to be applied with a longer timeout
    await waitFor(
      () => {
        expect(screen.getByText(/PCT5/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const removeButton = screen.getByTestId('remove-discount');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByTestId('discount-input')).toBeInTheDocument();
    });
  });
});
