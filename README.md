# SimplerCart - Front-End

A shopping cart application built with React 19, TypeScript, Redux Toolkit, and Tailwind CSS.

## Features

- Display a list of products fetched from an API
- Add products to cart
- Update product quantities in cart
- Apply discount codes
- Calculate totals with proper rounding
- Submit orders to the API
- Responsive design for all screen sizes
- Error handling with ErrorBoundary

## Tech Stack

- React 19
- TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Vite for build tooling
- Vitest and Testing Library for testing

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd simpler
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # React components
│   ├── __tests__/    # Component tests
│   ├── Cart.tsx      # Shopping cart component
│   ├── ErrorBoundary.tsx # Error handling component
│   ├── Header.tsx    # Application header
│   └── ProductList.tsx # Product listing component
├── services/         # API services
│   └── api.ts        # API client and methods
├── store/            # Redux store
│   ├── hooks.ts      # Custom Redux hooks
│   ├── index.ts      # Store configuration
│   └── slices/       # Redux slices
│       └── cartSlice.ts # Cart state management
├── App.css           # Application styles
├── App.tsx           # Main application component
├── index.css         # Global styles with Tailwind
├── main.tsx          # Application entry point
└── setupTests.ts     # Test configuration
```

## Features Implemented

1. **Product Listing**

   - Displays products from the API
   - Shows price, description, and stock information
   - Disables "Add to Cart" for out-of-stock items

2. **Shopping Cart**

   - Add/remove products
   - Update quantities
   - Real-time total calculation
   - Apply discount codes

3. **Checkout Process**

   - Submit order to API
   - Success confirmation
   - Error handling
