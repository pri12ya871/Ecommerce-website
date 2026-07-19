import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishList } from '../actions/wishlistActions';
import { setSearch } from '../actions/productActions';
import Rating from '../components/Rating';
import { formatPrice, imgSrc, onImgError } from '../utils';

export default function WishListScreen(props) {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
  }, [dispatch]);

  const moveToCart = (productId) => {
    dispatch(removeFromWishList(productId));
    props.history.push(`/cart/${productId}`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="page">
        <div className="empty-state fade-up">
          <i className="fa fa-heart-o"></i>
          <h2>Your wishlist is empty</h2>
          <p>
            Tap the <i className="fa fa-heart-o"></i> icon on any product to save
            it here for later.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: '2.8rem' }}>
        My Wishlist{' '}
        <span style={{ color: 'var(--muted)', fontSize: '1.6rem', fontWeight: 500 }}>
          ({wishlistItems.length} saved)
        </span>
      </h1>
      <div className="pgrid">
        {wishlistItems.map((item) => (
          <div key={item.product} className="pcard fade-up">
            <Link to={`/product/${item.product}`} className="pcard-media">
              <img src={imgSrc(item.image)} onError={onImgError} alt={item.name} />
            </Link>
            <button
              className="pcard-wish active link-plain"
              title="Remove from wishlist"
              onClick={() => dispatch(removeFromWishList(item.product))}
            >
              <i className="fa fa-heart"></i>
            </button>
            <div className="pcard-body">
              <Link to={`/product/${item.product}`}>
                <h3 className="pcard-name">{item.name}</h3>
              </Link>
              <Rating rating={item.rating} numReviews={item.numReviews} />
              <div className="pcard-priceline">
                <span className="price">{formatPrice(item.price)}</span>
              </div>
              <span
                className={`pcard-stock ${item.countInStock === 0 ? 'out' : 'in'}`}
              >
                {item.countInStock === 0 ? 'Out of stock' : 'In stock'}
              </span>
              <div className="pcard-actions">
                <button
                  className="btn btn-primary"
                  disabled={item.countInStock === 0}
                  onClick={() => moveToCart(item.product)}
                >
                  <i className="fa fa-shopping-bag"></i> Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
