import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Order } from '../models/Order';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL as string,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrder: builder.query<Order, string>({
      query: (orderId) => `/orders/${orderId}`,
    }),
  }),
});

export const { useGetOrderQuery } = ordersApi;