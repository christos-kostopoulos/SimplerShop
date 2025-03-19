import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetDiscountsQuery } from '../services/discountApi';
import type { Discount } from '../models/Discount';
import { applyDiscount, clearDiscount } from '../store/slices/cartSlice';
import { RootState } from '../store';

const Discount = () => {
  const dispatch = useDispatch();
  const [discountCode, setDiscountCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { data: discounts = [], isLoading } = useGetDiscountsQuery();
  const discount = useSelector((state: RootState) => state.cart.discount);

  const handleApplyDiscount = async () => {
    setError(null);

    if (!discountCode) {
      setError('Please enter a discount code');
      return;
    }

    const validDiscount = discounts.find((d: Discount) => d.code === discountCode);

    if (validDiscount) {
      dispatch(applyDiscount(validDiscount));
      setDiscountCode('');
    } else {
      setError('Invalid discount code');
    }
  };

  const handleClearDiscount = () => {
    dispatch(clearDiscount());
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Discount Code</h3>
      {discount ? (
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded mr-2">
            {discount.code} (
            {discount.type === 'PERCENTAGE' ? `${discount.amount}%` : `$${discount.amount}`})
          </span>
          <button onClick={handleClearDiscount} className="text-sm text-red-500 hover:text-red-700">
            Remove
          </button>
        </div>
      ) : (
        <div className="flex w-full">
          <input
            data-testid="discount-input"
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter discount code"
            className="border rounded-l px-3 py-2 w-full"
          />
          <button
            data-testid="apply-button"
            onClick={handleApplyDiscount}
            disabled={isLoading}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-r disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Apply'}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Discount;
