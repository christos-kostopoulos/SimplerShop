import { beforeEach, describe, expect, it, vi } from 'vitest';
import cartReducer, {
  addToCartLocal,
  removeFromCart,
  updateQuantity,
  applyDiscount,
  clearDiscount,
  clearCart,
  CartState,
} from '../cartSlice';
import { Product } from '../../../models/Product';
import { Discount } from '../../../models/Discount';

// Mock API services
vi.mock('../../../services/api', () => ({
  createCartApi: vi.fn(),
  getCartApi: vi.fn(),
  updateCartApi: vi.fn(),
  submitOrderApi: vi.fn(),
}));

describe('cartSlice', () => {
  // Sample product for tests
  const sampleProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 19.99,
    stock: 10,
  };

  // Sample discount for tests
  const sampleDiscount: Discount = {
    code: 'TEST10',
    amount: 10,
    type: 'PERCENTAGE',
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(cartReducer(undefined, { type: 'unknown' })).toEqual({
        cartId: null,
        items: [],
        discount: null,
        status: 'idle',
        error: null,
      });
    });

    it('should handle addToCartLocal when item does not exist', () => {
      const initialState: CartState = {
        cartId: null,
        items: [],
        discount: null,
        status: 'idle',
        error: null,
      };

      const action = addToCartLocal(sampleProduct);
      const state = cartReducer(initialState, action);

      expect(state.items).toEqual([
        {
          productId: '1',
          quantity: 1,
        },
      ]);
    });

    it('should handle addToCartLocal when item already exists', () => {
      const initialState: CartState = {
        cartId: null,
        items: [
          {
            productId: '1',
            quantity: 1,
          },
        ],
        discount: null,
        status: 'idle',
        error: null,
      };

      const action = addToCartLocal(sampleProduct);
      const state = cartReducer(initialState, action);

      expect(state.items).toEqual([
        {
          productId: '1',
          quantity: 2,
        },
      ]);
    });

    it('should handle removeFromCart', () => {
      const initialState: CartState = {
        cartId: null,
        items: [
          {
            productId: '1',
            quantity: 1,
          },
          {
            productId: '2',
            quantity: 1,
          },
        ],
        discount: null,
        status: 'idle',
        error: null,
      };

      const action = removeFromCart('1');
      const state = cartReducer(initialState, action);

      expect(state.items).toEqual([
        {
          productId: '2',
          quantity: 1,
        },
      ]);
    });

    it('should handle updateQuantity', () => {
      const initialState: CartState = {
        cartId: null,
        items: [
          {
            productId: '1',
            quantity: 1,
          },
        ],
        discount: null,
        status: 'idle',
        error: null,
      };

      const action = updateQuantity({ productId: '1', quantity: 3 });
      const state = cartReducer(initialState, action);

      expect(state.items[0].quantity).toEqual(3);
    });

    it('should handle applyDiscount', () => {
      const initialState: CartState = {
        cartId: null,
        items: [],
        discount: null,
        status: 'idle',
        error: null,
      };

      const action = applyDiscount(sampleDiscount);
      const state = cartReducer(initialState, action);

      expect(state.discount).toEqual(sampleDiscount);
    });

    it('should handle clearDiscount', () => {
      const initialState: CartState = {
        cartId: null,
        items: [],
        discount: sampleDiscount,
        status: 'idle',
        error: null,
      };

      const action = clearDiscount();
      const state = cartReducer(initialState, action);

      expect(state.discount).toBeNull();
    });

    it('should handle clearCart', () => {
      const initialState: CartState = {
        cartId: 'test-cart-id',
        items: [
          {
            productId: '1',
            quantity: 1,
          },
        ],
        discount: sampleDiscount,
        status: 'idle',
        error: null,
      };

      const action = clearCart();
      const state = cartReducer(initialState, action);

      expect(state.items).toEqual([]);
      expect(state.discount).toBeNull();
      // cartId should remain unchanged
      expect(state.cartId).toEqual('test-cart-id');
    });
  });
});
