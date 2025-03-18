import { useAppSelector } from '../store/hooks';
import { useGetOrderQuery } from '../services/ordersApi';

const OrdersPage = () => {
  const orderIds = useAppSelector((state) => state.orders.orderIds);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orderIds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orderIds.map((orderId) => (
            <OrderCard key={orderId} orderId={orderId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
