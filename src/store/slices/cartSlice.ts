import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createCartApi, updateCartApi, submitOrderApi, CartItemRequest } from '../../services/api';
import axios from 'axios';
import { Product } from '../../models/Product';
import { Discount } from '../../models/Discount';
import { CartItem } from '../../models/CartItem';

export interface CartState {
  cartId: string | null;
  items: CartItem[];
  discount: Discount | null;
  status: 'idle' | 'loading' | 'fulfilled' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  cartId: null,
  items: [],
  discount: null,
  status: 'idle',
  error: null,
};

// Add to cart thunk that creates a cart if needed
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (product: Product, { getState, dispatch }) => {
    const { cart } = getState() as { cart: CartState };

    // First add the item to the local cart state
    dispatch(addToCartLocal(product));

    // If no cart ID exists, create one first
    if (!cart.cartId) {
      try {
        await dispatch(createCart()).unwrap();
      } catch (error) {
        console.error('Failed to create cart:', error);
        return { success: false };
      }
    }

    // Update cart on server
    try {
      await dispatch(updateCartItems()).unwrap();
      return { success: true, product };
    } catch (error) {
      console.error('Failed to update cart:', error);
      return { success: false };
    }
  }
);

export const submitOrder = createAsyncThunk(
  'cart/submitOrder',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const { cart } = getState() as { cart: CartState };

    if (!cart.cartId) {
      try {
        // First create and update the cart
        await dispatch(createCart()).unwrap();
        await dispatch(updateCartItems()).unwrap();
      } catch (error) {
        return rejectWithValue('Failed to create cart for order');
      }
    }

    const currentState = getState() as { cart: CartState };

    if (!currentState.cart.cartId) {
      return rejectWithValue('No cart ID available for order');
    }

    try {
      const orderData = {
        cart_id: currentState.cart.cartId,
        discount_code: currentState.cart.discount?.code || '',
      };

      // Import the addOrderId action
      const { addOrderId } = await import('../slices/ordersSlice');

      const response = await submitOrderApi(orderData);
      
      // Extract the order ID from the Location header
      if (response.headers && response.headers.location) {
        const locationPath = response.headers.location;
        // Extract order ID from path like "/orders/30b2516c-0c8d-4c25-b6fa-08ec265ac0ee"
        const orderId = locationPath.split('/').pop();
        if (orderId) {
          dispatch(addOrderId(orderId));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error submitting order:', error);
      return rejectWithValue('Failed to submit order');
    }
  }
);

export const createCart = createAsyncThunk('cart/createCart', async (_) => {
  const response = await createCartApi();
  if (response) {
    const id = response.split('/').pop();
    if (id) {
      return { id };
    }
  }
  throw new Error('Could not extract cart ID from Location header');
});

export const updateCartItems = createAsyncThunk(
  'cart/updateCartItems',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const { cart } = getState() as { cart: CartState };

    if (!cart.cartId) {
      // Create a cart if it doesn't exist
      try {
        await dispatch(createCart()).unwrap();

        const updatedState = getState() as { cart: CartState };
        if (!updatedState.cart.cartId) {
          return rejectWithValue('Failed to create cart');
        }
      } catch (error) {
        return rejectWithValue('Failed to create cart');
      }
    }

    try {
      const cartItems: CartItemRequest[] = cart.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      }));

      // Get the latest cart ID from state
      const currentState = getState() as { cart: CartState };
      const cartId = currentState.cart.cartId;

      if (!cartId) {
        return rejectWithValue('No cart ID available');
      }

      const response = await updateCartApi(cartId, cartItems);
      return response;
    } catch (error) {
      console.error('Error updating cart:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // If cart not found, create a new one and try again
        try {
          await dispatch(createCart()).unwrap();

          dispatch(updateCartItems());
          return { success: true };
        } catch (createError) {
          return rejectWithValue('Failed to create new cart after 404');
        }
      }
      return rejectWithValue('Failed to update cart items');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          productId: product.id,
          quantity: 1,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        item.quantity = quantity;
      }
    },
    applyDiscount: (state, action: PayloadAction<Discount>) => {
      state.discount = action.payload;
    },
    clearDiscount: (state) => {
      state.discount = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.discount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.fulfilled, (state) => {
        state.items = [];
        state.discount = null;
        state.status = 'fulfilled';
      })
      .addCase(createCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.cartId = action.payload.id;
      })
      .addCase(createCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create cart';
      })
      .addCase(updateCartItems.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        if (action.payload && 'id' in action.payload) {
          state.cartId = action.payload.id;
        }
      })
      .addCase(updateCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update cart items';
      })
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'fulfilled';
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add item to cart';
      });
  },
});

export const {
  addToCartLocal,
  removeFromCart,
  updateQuantity,
  applyDiscount,
  clearDiscount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
