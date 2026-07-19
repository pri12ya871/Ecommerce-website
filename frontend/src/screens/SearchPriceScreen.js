import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchCustomerProducts } from '../actions/customerActions';
import CustomerProduct from '../components/CustomerProduct';
import AdminProduct from '../components/AdminProduct';
import ShopResults from '../components/ShopResults';
import { searchProducts, setSearch } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { formatPrice } from '../utils';

export default function SearchPriceScreen(props) {
  const dispatch = useDispatch();

  const { adminInfo } = useSelector((state) => state.userSignin);
  const { customerInfo } = useSelector((state) => state.customerSignin);
  const { customerSearched } = useSelector((state) => state.customerSearchedList);
  const { loading, error, allSearchProducts } = useSelector(
    (state) => state.searchedProducts
  );

  const min = props.match.params.min;
  const max = props.match.params.max;
  const option = props.match.params.option;

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    if (max && min && option) {
      if (!customerInfo) {
        dispatch(searchProducts(option, 'search', min, max));
      } else {
        dispatch(searchCustomerProducts(option, 'search', min, max));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, min, max, option]);

  if (customerInfo) {
    return (
      <div className="page">
        <Link to="/customerproductlist" onClick={() => { localStorage.removeItem('search'); dispatch(setSearch()); }}>
          <i className="fa fa-long-arrow-left"></i> Back to my products
        </Link>
        {!customerSearched || customerSearched.length === 0 ? (
          <MessageBox>No results found.</MessageBox>
        ) : (
          <div className="row center">
            {customerSearched.map((product) => (
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
        ) : !allSearchProducts || allSearchProducts.length === 0 ? (
          <MessageBox>No results found.</MessageBox>
        ) : (
          <div className="row center">
            {allSearchProducts.map((product) => (
              <AdminProduct key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const crumb = `Price: ${formatPrice(min)} – ${formatPrice(max)}`;

  return (
    <ShopResults
      title={crumb}
      crumb={crumb}
      loading={loading}
      error={error}
      products={allSearchProducts || []}
    />
  );
}
