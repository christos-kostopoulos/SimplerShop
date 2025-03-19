import { useAppSelector } from '../store/hooks';
import OrderCard from '../components/OrderCart';
import ErrorBoundary from '../components/ErrorBoundary';

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
            <ErrorBoundary
              key={orderId}
              fallback={
                <div className="border rounded-lg p-4 shadow-sm bg-red-50">
                  <p className="text-red-600">Error loading order #{orderId.substring(0, 8)}...</p>
                </div>
              }
            >
              <OrderCard orderId={orderId} />
            </ErrorBoundary>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
