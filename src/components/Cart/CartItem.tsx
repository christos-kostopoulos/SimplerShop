import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectProductById } from '../../store/slices/productSlice';
import { CartItem as CartItemModel } from '../../models/CartItem';
import { roundToTwoDecimals } from '../../utils';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

const CartItem = ({ productId, quantity }: CartItemModel) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => selectProductById(state, productId));

  const handleRemoveItem = () => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  return (
    <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-center mb-4 sm:mb-0">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-gray-600 text-sm">${product.price.toFixed(2)} each</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center border rounded mr-4">
          <button
            onClick={() => handleQuantityChange(product.id, quantity - 1)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(product.id, quantity + 1)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
        <div className="flex items-center">
          <span className="font-medium mr-4">
            ${roundToTwoDecimals(product.price * quantity).toFixed(2)}
          </span>
          <button
            data-testid="remove-button"
            onClick={handleRemoveItem}
            className="text-red-500 hover:text-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
