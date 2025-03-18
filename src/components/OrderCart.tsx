import { useGetOrderQuery } from '../services/ordersApi';

const OrderCard = ({ orderId }: { orderId: string }) => {
  const { data: order, isLoading, error } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 shadow-sm animate-pulse bg-gray-50">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="border rounded-lg p-4 shadow-sm bg-red-50">
        <p className="text-red-600">Failed to load order #{orderId}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Order #{orderId.substring(0, 8)}...</h2>
        <span className="text-green-600 font-medium">Completed</span>
      </div>

      <div className="divide-y">
        {order.items.map((item, index) => (
          <div key={index} className="py-2 flex justify-between">
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t flex justify-between">
        <span className="font-bold">Total</span>
        <span className="font-bold">${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderCard;
