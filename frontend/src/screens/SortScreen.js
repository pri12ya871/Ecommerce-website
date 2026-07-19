import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminProduct from '../components/AdminProduct';
import CustomerProduct from '../components/CustomerProduct';
import ShopResults from '../components/ShopResults';
import { sortProducts, setSearch } from '../actions/productActions';
import { sortCustomerProducts } from '../actions/customerActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const SORT_LABELS = {
  sortPricea: 'Price: Low to High',
  sortPriced: 'Price: High to Low',
  sortNamea: 'Name: A to Z',
  sortNamed: 'Name: Z to A',
  sortRatinga: 'Rating: Low to High',
  sortRatingd: 'Top Rated',
};

export default function SortScreen(props) {
  const dispatch = useDispatch();
  const option = props.match.params.sortValue;

  const { loading, error, sortedProducts } = useSelector(
    (state) => state.sortedProductList
  );
  const { adminInfo } = useSelector((state) => state.userSignin);
  const { customerInfo } = useSelector((state) => state.customerSignin);
  const { sortedCustomerProducts } = useSelector(
    (state) => state.sortedCustomerPoductList
  );

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    if (!customerInfo) {
      dispatch(sortProducts(option));
    } else {
      dispatch(sortCustomerProducts(option));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, option]);

  if (customerInfo) {
    return (
      <div className="page">
        <Link to="/customerproductlist" onClick={() => { localStorage.removeItem('search'); dispatch(setSearch()); }}>
          <i className="fa fa-long-arrow-left"></i> Back to my products
        </Link>
        {!sortedCustomerProducts || sortedCustomerProducts.length === 0 ? (
          <MessageBox>No results found.</MessageBox>
        ) : (
          <div className="row center">
            {sortedCustomerProducts.map((product) => (
              <CustomerProduct key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (adminInfo) {
    return (
      <div className="page">
        <Link to="/adminproductlist" onClick={() => { localStorage.removeItem('search'); dispatch(setSearch()); }}>
          <i className="fa fa-long-arrow-left"></i> Back to products
        </Link>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="row center">
            {(sortedProducts || []).map((product) => (
              <AdminProduct key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const crumb = SORT_LABELS[option] || 'Products';

  return (
    <ShopResults
      title={crumb}
      crumb={crumb}
      loading={loading}
      error={error}
      products={sortedProducts || []}
    />
  );
}
