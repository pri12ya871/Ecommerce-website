import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminProduct from '../components/AdminProduct';
import CustomerProduct from '../components/CustomerProduct';
import ShopResults from '../components/ShopResults';
import { searchProducts, setSearch } from '../actions/productActions';
import { searchCustomerProducts } from '../actions/customerActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SearchScreen(props) {
  const dispatch = useDispatch();

  const { adminInfo } = useSelector((state) => state.userSignin);
  const { customerInfo } = useSelector((state) => state.customerSignin);
  const { customerSearched } = useSelector((state) => state.customerSearchedList);
  const { loading, error, allSearchProducts } = useSelector(
    (state) => state.searchedProducts
  );

  const search = props.match.params.search;
  const option = props.match.params.option;

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    if (!customerInfo) {
      dispatch(searchProducts(option, search));
    } else {
      dispatch(searchCustomerProducts(option, search));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, option, search]);

  // Seller view keeps its own management cards.
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

  // Admin view keeps management cards too.
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

  const label =
    option === 'category'
      ? decodeURIComponent(search)
      : option === 'rating'
      ? `Rated ${search}★ & up`
      : `Results for “${decodeURIComponent(search)}”`;

  return (
    <ShopResults
      title={label}
      crumb={label}
      loading={loading}
      error={error}
      products={allSearchProducts || []}
    />
  );
}
