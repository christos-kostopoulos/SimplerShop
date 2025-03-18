import ProductList from '../components/ProductList';

const HomePage = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className={`lg:flex-1`}>
        <ProductList />
      </div>
    </div>
  );
};

export default HomePage;
