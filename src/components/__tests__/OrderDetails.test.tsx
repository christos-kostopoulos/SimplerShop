import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { describe, expect, it, beforeEach } from 'vitest';
import { Product } from '../../models/Product';
import { getTestStore, TestStore } from '../../setupTests';
import OrderDetails from '../OrderDetails';

describe('OrderDetails Component', () => {
  const mockProduct: Product = {
    id: '1',
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
  let store: TestStore;

  beforeEach(() => {
    store = getTestStore();
  });

  it('renders the OrderDetails component without any discount', () => {
    store.dispatch({ type: 'SET_STATE', payload: preloadedState });

    render(
      <Provider store={store}>
        <OrderDetails />
      </Provider>
    );

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('$39.98')).toHaveLength(2);
  });

  it('renders the OrderDetails component with a percentage discount', () => {
    const stateWithDiscount = {
      ...preloadedState,
      cart: {
        ...preloadedState.cart,
        discount: {
          code: 'TEST10',
          type: 'PERCENTAGE',
          amount: 10,
        },
      },
    };

    store.dispatch({ type: 'SET_STATE', payload: stateWithDiscount });

    render(
      <Provider store={store}>
        <OrderDetails />
      </Provider>
    );

    expect(screen.getByText('$39.98')).toBeInTheDocument();

    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('-$4.00')).toBeInTheDocument();

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$35.98')).toBeInTheDocument();
  });

  it('renders the OrderDetails component with a percentage discount', () => {
    const stateWithDiscount = {
      ...preloadedState,
      cart: {
        ...preloadedState.cart,
        discount: {
          code: 'TEST10',
          type: 'FLAT',
          amount: 5,
        },
      },
    };

    store.dispatch({ type: 'SET_STATE', payload: stateWithDiscount });

    render(
      <Provider store={store}>
        <OrderDetails />
      </Provider>
    );

    expect(screen.getByText('$39.98')).toBeInTheDocument();

    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('-$5.00')).toBeInTheDocument();

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$34.98')).toBeInTheDocument();
  });
});
