import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearCart, submitOrder } from '../../store/slices/cartSlice';
import CartItemsList from './CartItemsList';
import Discount from '../Discount';
import OrderDetails from '../OrderDetails';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, discount, cartId } = useAppSelector((state) => state.cart);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      // Use the submitOrder thunk which handles cart creation if needed
      const result = await dispatch(submitOrder()).unwrap();
      setCheckoutSuccess(true);
    } catch (err) {
      setError('Error processing checkout');
      console.error('Error processing checkout:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="bg-green-50 border border-green-400 text-green-700 px-6 py-8 rounded-lg mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="mb-6">Thank you for your purchase.</p>
        <button
          onClick={() => setCheckoutSuccess(false)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty!</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            <CartItemsList items={items} />
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <Discount />
            <OrderDetails />
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className={`mt-6 w-full py-3 px-4 rounded font-medium ${
                isCheckingOut || items.length === 0
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
