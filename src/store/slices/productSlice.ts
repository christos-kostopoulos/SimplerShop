import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { Product } from '../../models/Product';
import { fetchProductsApi } from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', fetchProductsApi);

export const productsAdapter = createEntityAdapter<Product>();

const initialState = productsAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        productsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
  selectEntities: selectProductEntities,
} = productsAdapter.getSelectors((state: any) => state.products);

export const selectProductStatus = (state: any) => state.products.status;
export const selectProductError = (state: any) => state.products.error;
