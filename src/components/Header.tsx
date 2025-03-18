import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateCartItems } from '../store/slices/cartSlice';
import './Cart/CartFlyout.css';
import Cart from './Cart/Cart';

const Header = () => {
  const { items, cartId } = useAppSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  // Calculate total items in cart
  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Update cart in API when items change
  useEffect(() => {
    if (cartId && items.length > 0) {
      dispatch(updateCartItems());
    }
  }, [items, cartId, dispatch]);

  // Close cart flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              SimplerCart
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
              }
            >
              Orders
            </NavLink>
          </nav>

          {/* Cart Button with Flyout */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-700 hover:text-blue-600"
              aria-label="Cart"
              aria-expanded={isCartOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Cart Flyout Menu */}
            {isCartOpen && (
              <div className="absolute right-0 z-10 mt-5 w-screen max-w-md">
                <div className="w-full overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5">
                  <Cart />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 font-medium py-1'
                    : 'text-gray-700 hover:text-blue-600 py-1'
                }
                end
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 font-medium py-1'
                    : 'text-gray-700 hover:text-blue-600 py-1'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </NavLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
