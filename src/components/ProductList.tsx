import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectAllProducts,
  selectProductStatus,
  selectProductError,
  fetchProducts,
} from '../store/slices/productSlice';
import { Product } from '../models/Product';
import { useEffect, useState } from 'react';
import { addItemToCart } from '../store/slices/cartSlice';

const ProductList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const { items } = useAppSelector((state) => state.cart);
  const status = useAppSelector(selectProductStatus);
  const error = useAppSelector(selectProductError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = async (product: Product) => {
    // Set loading state for this specific product
    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    try {
      await dispatch(addItemToCart(product));
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      // Clear loading state
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const checkQuantity = (id: string): number => {
    return items.find((i) => i.productId === id)?.quantity ?? 0;
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                <span
                  className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={
                    product.stock <= checkQuantity(product.id) || isAddingToCart[product.id]
                  }
                  className={`w-full py-2 px-4 rounded ${
                    product.stock > checkQuantity(product.id)
                      ? isAddingToCart[product.id]
                        ? 'bg-blue-400 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  {isAddingToCart[product.id]
                    ? 'Adding...'
                    : product.stock > checkQuantity(product.id)
                      ? 'Add to Cart'
                      : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
