import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getTestStore, TestStore } from '../../setupTests';
import OrderCard from '../OrderCart';
import * as ordersApiHooks from '../../services/ordersApi';

vi.mock('../../services/ordersApi', async () => {
  const actual = await vi.importActual('../../services/ordersApi');
  return {
    ...actual,
    useGetOrderQuery: vi.fn(),
  };
});

describe('OrderCard Component', () => {
  let store: TestStore;

  beforeEach(() => {
    store = getTestStore();
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    // Mock the hook to return loading state
    vi.mocked(ordersApiHooks.useGetOrderQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
      isSuccess: false,
      isError: false,
      currentData: undefined,
      fulfilledTimeStamp: undefined,
      status: 'pending',
      endpointName: 'getOrder',
      requestId: 'test-request-id',
      originalArgs: 'test-order-id',
      startedTimeStamp: 0,
    });

    render(
      <Provider store={store}>
        <OrderCard orderId="test-order-id" />
      </Provider>
    );

    const loadingElement = document.querySelector('.animate-pulse');
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    vi.mocked(ordersApiHooks.useGetOrderQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 404, data: 'Not found' },
      refetch: vi.fn(),
      isFetching: false,
      isSuccess: false,
      isError: true,
      currentData: undefined,
      fulfilledTimeStamp: undefined,
      status: 'rejected',
      endpointName: 'getOrder',
      requestId: 'test-request-id',
      originalArgs: 'test-order-id',
      startedTimeStamp: 0,
    });

    render(
      <Provider store={store}>
        <OrderCard orderId="test-order-id" />
      </Provider>
    );

    expect(screen.getByText(/Failed to load order #test-order-id/i)).toBeInTheDocument();
  });

  it('renders order data correctly', () => {
    const mockOrder = {
      id: 'test-order-id',
      items: [
        {
          quantity: 2,
          product: {
            id: 'product-1',
            name: 'Test Product 1',
            price: 19.99,
            stock: 10,
          },
        },
        {
          quantity: 1,
          product: {
            id: 'product-2',
            name: 'Test Product 2',
            price: 29.99,
            stock: 5,
          },
        },
      ],
      total: 69.97,
    };

    vi.mocked(ordersApiHooks.useGetOrderQuery).mockReturnValue({
      data: mockOrder,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
      isSuccess: true,
      isError: false,
      currentData: mockOrder,
      fulfilledTimeStamp: 123456789,
      status: 'fulfilled',
      endpointName: 'getOrder',
      requestId: 'test-request-id',
      originalArgs: 'test-order-id',
      startedTimeStamp: 0,
    });

    render(
      <Provider store={store}>
        <OrderCard orderId="test-order-id" />
      </Provider>
    );

    expect(screen.getByText(/Order #test-ord/i)).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('$39.98')).toBeInTheDocument();

    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Qty: 1')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$69.97')).toBeInTheDocument();
  });
});
