import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { addItemToCart } from '../../store/slices/cartSlice';
import ProductList from '../ProductList';
import { testStore } from '../../setupTests';

// Sample product data
const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 19.99,
    description: 'This is a test product',
    image: 'test-image-1.jpg',
    stock: 10,
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 29.99,
    description: 'This is another test product',
    image: 'test-image-2.jpg',
    stock: 5,
  },
  {
    id: '3',
    name: 'Out of Stock Product',
    price: 39.99,
    description: 'This product is out of stock',
    image: 'test-image-3.jpg',
    stock: 0,
  },
];

// Mock the Redux actions
vi.mock('../../store/slices/productSlice', async () => {
  const actual = await vi.importActual('../../store/slices/productSlice');
  return {
    ...actual,
    fetchProducts: vi.fn().mockImplementation(() => ({
      type: 'products/fetchAll/fulfilled',
      payload: mockProducts,
    })),
    selectAllProducts: vi.fn().mockImplementation((state) => {
      // If the state has entities with mockProducts IDs, return mockProducts
      // This simulates how the entity adapter works
      return mockProducts;
    }),
    selectProductStatus: vi.fn().mockImplementation((state) => state.products.status),
    selectProductError: vi.fn().mockImplementation((state) => state.products.error),
  };
});

vi.mock('../../store/slices/cartSlice', async () => {
  const actual = await vi.importActual('../../store/slices/cartSlice');
  return {
    ...actual,
    addItemToCart: vi.fn().mockImplementation((product) => ({
      type: 'cart/addItemToCart',
      payload: { product },
    })),
  };
});

describe('ProductList Component', () => {
  const store = testStore;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Pre-populate store with mock data
    store.dispatch({
      type: 'products/fetchAll/fulfilled',
      payload: mockProducts,
    });
  });

  it('renders loading state initially', () => {
    // Set loading state
    store.dispatch({
      type: 'products/fetchAll/pending',
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Check if loading indicator is present
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    // Set success state
    store.dispatch({
      type: 'products/fetchAll/fulfilled',
      payload: mockProducts,
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Products should be available
    const product1 = screen.getByText('Test Product 1');
    const product2 = screen.getByText('Test Product 2');
    const outOfStockProduct = screen.getByText('Out of Stock Product');

    expect(product1).toBeInTheDocument();
    expect(product2).toBeInTheDocument();
    expect(outOfStockProduct).toBeInTheDocument();

    // Check if prices are displayed correctly
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();

    // Check stock information
    expect(screen.getByText('10 in stock')).toBeInTheDocument();
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();

    // Check if the last button is disabled since it is out of stock
    const outOfStockButton = screen.getByText('Out of Stock');

    // Check if the button is disabled
    expect(outOfStockButton).toBeDisabled();
  });

  it('adds product to cart when "Add to Cart" button is clicked', async () => {
    // Set the store state for products
    store.dispatch({
      type: 'products/fetchAll/fulfilled',
      payload: mockProducts,
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Find the "Add to Cart" buttons
    const addToCartButtons = screen.getAllByText('Add to Cart');

    // Click the first "Add to Cart" button
    fireEvent.click(addToCartButtons[0]);

    // Check if the dispatch was called
    expect(dispatchSpy).toHaveBeenCalled();
    expect(addItemToCart).toHaveBeenCalled();
  });

  it('disables "Add to Cart" button for out of stock products', async () => {
    // Set the store state for products
    store.dispatch({
      type: 'products/fetchAll/fulfilled',
      payload: mockProducts,
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Find the "Out of Stock" button
    const outOfStockButton = screen.getByText('Out of Stock');

    // Check if the button is disabled
    expect(outOfStockButton).toBeDisabled();
  });

  it('shows error message when API fails', async () => {
    // Set the store state for failed products fetch
    store.dispatch({
      type: 'products/fetchAll/rejected',
      error: { message: 'Failed to load products' },
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    // Check for error message
    const errorMessage = screen.getByText(/Failed to load products/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
