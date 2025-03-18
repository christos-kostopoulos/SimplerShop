import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Discount } from '../models/Discount';

export const discountApi = createApi({
  reducerPath: 'discountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL as string,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDiscounts: builder.query<Discount[], void>({
      query: () => '/discounts',
    }),
  }),
});

export const { useGetDiscountsQuery } = discountApi;
