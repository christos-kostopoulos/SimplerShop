import ProductList from '../components/ProductList';
import ErrorBoundary from '../components/ErrorBoundary';

const HomePage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className={`lg:flex-1`}>
        <ErrorBoundary
          fallback={
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
              <strong className="font-bold">Error loading products!</strong>
              <span className="block sm:inline">
                {' '}
                Please try refreshing the page or contact support.
              </span>
            </div>
          }
        >
          <ProductList />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default HomePage;
