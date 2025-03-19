// src/services/__mocks__/discountApi.ts

import { vi } from 'vitest';
import { createApi } from '@reduxjs/toolkit/query/react';

const mockDiscounts = [
  { code: 'PCT5', type: 'PERCENTAGE', amount: 5 },
  { code: 'FIX10', type: 'FLAT', amount: 10 }, // Changed from FIXED to FLAT to match the model
];

export const useGetDiscountsQuery = vi.fn().mockReturnValue({
  data: mockDiscounts,
  isLoading: false,
  isSuccess: true,
  isError: false,
});

// Create a proper mock API with a valid reducer
export const discountApi = createApi({
  reducerPath: 'discountApi',
  baseQuery: () => ({ data: null }),
  endpoints: (builder) => ({
    getDiscounts: builder.query({
      queryFn: () => ({ data: mockDiscounts }),
    }),
  }),
});

// Override the hook with our mocked version
discountApi.useGetDiscountsQuery = useGetDiscountsQuery;
