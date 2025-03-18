import { CartItem as CartItemModel } from '../../models/CartItem';
import CartItem from './CartItem';

interface CartItemListProps {
  items: CartItemModel[];
}
const CartItemsList = ({ items }: CartItemListProps) => {
  return (
    <div>
      {items.map((item) => (
        <CartItem key={item.productId} {...item} />
      ))}
    </div>
  );
};
export default CartItemsList;
