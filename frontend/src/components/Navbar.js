import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../actions/userActions';
import { signoutCustomer } from '../actions/customerActions';
import SearchBox from './SearchBox';

export const CATEGORIES = [
  'Mobiles & Tablets',
  'Electronics',
  "Men's Fashion",
  "Women's Fashion",
  'Watches',
  'Beauty & Care',
  'Home & Kitchen',
  'Accessories',
  'Sports & Fitness',
];

export default function Navbar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');

  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo, adminInfo } = useSelector((state) => state.userSignin);
  const { customerInfo } = useSelector((state) => state.customerSignin);

  const signoutHandler = () => {
    dispatch(signout());
    dispatch(signoutCustomer());
  };

  const homeLink = adminInfo
    ? '/adminproductlist'
    : customerInfo
    ? '/customerproductlist'
    : '/';

  const goCategory = (cat) => {
    setMenuOpen(false);
    history.push(`/search/category/${encodeURIComponent(cat)}`);
  };

  const submitMobileSearch = (e) => {
    e.preventDefault();
    if (!mobileSearch.trim()) return;
    setMenuOpen(false);
    history.push(`/search/name/${encodeURIComponent(mobileSearch.trim())}`);
  };

  return (
    <>
      <div className="topstrip">
        <b>Free shipping</b> on orders over $50 &nbsp;·&nbsp; Easy 30-day returns
        &nbsp;·&nbsp; <b>SUMMER26</b> for 10% off
      </div>

      <header className="navbar">
        <div className="navbar-inner">
          <button
            className="nav-burger link-plain"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fa ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          <Link className="brand" to={homeLink}>
            ICON<span className="dot">.</span>
            <span className="brand-tag">Store</span>
          </Link>

          {!adminInfo && !customerInfo && (
            <div className="nav-search">
              <SearchBox />
            </div>
          )}

          <nav className="nav-actions">
            {!customerInfo && !adminInfo && (
              <>
                <Link className="nav-icon" to="/wishlist">
                  <i className="fa fa-heart-o"></i>
                  <span className="nav-label">Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <span className="badge">{wishlistItems.length}</span>
                  )}
                </Link>
                <Link className="nav-icon" to="/cart">
                  <i className="fa fa-shopping-bag"></i>
                  <span className="nav-label">Cart</span>
                  {cartItems.length > 0 && (
                    <span className="badge">{cartItems.length}</span>
                  )}
                </Link>
              </>
            )}

            {userInfo ? (
              <div className="dropdown">
                <span className="nav-icon" style={{ cursor: 'pointer' }}>
                  <i className="fa fa-user-o"></i>
                  <span className="nav-label">
                    {userInfo.name.split(' ')[0]} <i className="fa fa-caret-down"></i>
                  </span>
                </span>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">
                      <i className="fa fa-user-o"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">
                      <i className="fa fa-cube"></i> My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      <i className="fa fa-sign-out"></i> Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : adminInfo ? (
              <div className="dropdown">
                <span className="nav-icon" style={{ cursor: 'pointer' }}>
                  <i className="fa fa-shield"></i>
                  <span className="nav-label">
                    Admin <i className="fa fa-caret-down"></i>
                  </span>
                </span>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/admindashboard">
                      <i className="fa fa-tachometer"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/adminproductlist">
                      <i className="fa fa-cubes"></i> Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/adminaddproduct">
                      <i className="fa fa-plus-circle"></i> Add Product
                    </Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      <i className="fa fa-sign-out"></i> Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : customerInfo ? (
              <div className="dropdown">
                <span className="nav-icon" style={{ cursor: 'pointer' }}>
                  <i className="fa fa-briefcase"></i>
                  <span className="nav-label">
                    Seller <i className="fa fa-caret-down"></i>
                  </span>
                </span>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/customerprofile">
                      <i className="fa fa-user-o"></i> Seller Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/customerproductlist">
                      <i className="fa fa-cubes"></i> My Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/customeraddrequestproduct">
                      <i className="fa fa-plus-circle"></i> Add Request
                    </Link>
                  </li>
                  <li>
                    <Link to="/customerrequeststatus">
                      <i className="fa fa-hourglass-half"></i> Request Status
                    </Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      <i className="fa fa-sign-out"></i> Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="nav-icon" to="/signin">
                <i className="fa fa-user-o"></i>
                <span className="nav-label">Sign In</span>
              </Link>
            )}
          </nav>
        </div>

        {!adminInfo && !customerInfo && (
          <div className="catbar">
            <div className="catbar-inner">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/search/category/${encodeURIComponent(cat)}`}
                >
                  {cat}
                </Link>
              ))}
              <Link className="deal" to="/sort/sortRatingd">
                <i className="fa fa-bolt"></i> Top Rated
              </Link>
            </div>
          </div>
        )}

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <form className="searchbar" onSubmit={submitMobileSearch} style={{ marginBottom: '1.2rem' }}>
            <input
              type="text"
              value={mobileSearch}
              placeholder="Search products…"
              onChange={(e) => setMobileSearch(e.target.value)}
            />
            <button className="search-btn link-plain" type="submit" aria-label="Search">
              <i className="fa fa-search"></i>
            </button>
          </form>
          {CATEGORIES.map((cat) => (
            <Link key={cat} to="#" onClick={(e) => { e.preventDefault(); goCategory(cat); }}>
              {cat}
            </Link>
          ))}
        </div>
      </header>
    </>
  );
}
