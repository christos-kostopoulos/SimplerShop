import { useAppSelector } from '../store/hooks';
import { selectProductEntities } from '../store/slices/productSlice';
import { roundToTwoDecimals } from '../utils';

const OrderDetails = () => {
  const products = useAppSelector(selectProductEntities);
  const { items, discount } = useAppSelector((state) => state.cart);

  // // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    return total + products[item.productId].price * item.quantity;
  }, 0);

  // // Calculate discount amount
  const discountAmount = discount
    ? discount.type === 'PERCENTAGE'
      ? roundToTwoDecimals(subtotal * (discount.amount / 100))
      : discount.amount
    : 0;

  const grandTotal = roundToTwoDecimals(subtotal - discountAmount);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {discount && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between font-bold text-lg pt-2 border-t">
        <span>Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderDetails;
