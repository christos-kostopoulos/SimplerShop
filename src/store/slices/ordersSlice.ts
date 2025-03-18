import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrdersState {
  orderIds: string[];
}

const initialState: OrdersState = {
  orderIds: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrderId: (state, action: PayloadAction<string>) => {
      if (!state.orderIds.includes(action.payload)) {
        state.orderIds.push(action.payload);
      }
    },
    clearOrderIds: (state) => {
      state.orderIds = [];
    },
  },
});

export const { addOrderId, clearOrderIds } = ordersSlice.actions;
export default ordersSlice.reducer;