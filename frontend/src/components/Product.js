import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList, removeFromWishList } from '../actions/wishlistActions';
import { addToCart } from '../actions/cartActions';
import { formatPrice, imgSrc, onImgError, discountOf } from '../utils';
import Rating from './Rating';
import QuickView from './QuickView';

const NEW_WINDOW_DAYS = 30;

export default function Product({ product }) {
  const dispatch = useDispatch();
  const [quickView, setQuickView] = useState(false);
  const [added, setAdded] = useState(false);

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const wished = wishlistItems.some((item) => item.product === product._id);

  const discount = discountOf(product);
  const outOfStock = product.countInStock === 0;
  const lowStock = !outOfStock && product.countInStock <= 5;
  const isNew =
    product.createdAt &&
    Date.now() - new Date(product.createdAt).getTime() <
      NEW_WINDOW_DAYS * 24 * 3600 * 1000;

  const toggleWish = () => {
    if (wished) {
      dispatch(removeFromWishList(product._id));
    } else {
      dispatch(addToWishList(product._id));
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart(product._id, 1));
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="pcard fade-up">
      <Link to={`/product/${product._id}`} className="pcard-media">
        <img src={imgSrc(product.image)} onError={onImgError} alt={product.name} loading="lazy" />
        <span className="pcard-flags">
          {discount > 0 && <span className="flag flag-sale">-{discount}%</span>}
          {isNew && <span className="flag flag-new">NEW</span>}
          {outOfStock && <span className="flag flag-out">SOLD OUT</span>}
        </span>
      </Link>

      <button
        className={`pcard-wish link-plain ${wished ? 'active' : ''}`}
        title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={toggleWish}
      >
        <i className={wished ? 'fa fa-heart' : 'fa fa-heart-o'}></i>
      </button>

      <button className="pcard-quick link-plain" onClick={() => setQuickView(true)}>
        <i className="fa fa-eye"></i> Quick View
      </button>

      <div className="pcard-body">
        <span className="pcard-brand">{product.brand}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="pcard-name">{product.name}</h3>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div className="pcard-priceline">
          <span className="price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="price-old">{formatPrice(product.oldPrice)}</span>
          )}
          {discount > 0 && <span className="price-off">{discount}% off</span>}
        </div>
        <span
          className={`pcard-stock ${outOfStock ? 'out' : lowStock ? 'low' : 'in'}`}
        >
          {outOfStock
            ? 'Out of stock'
            : lowStock
            ? `Only ${product.countInStock} left`
            : 'In stock'}
        </span>
        <div className="pcard-actions">
          <button
            className="btn btn-primary"
            disabled={outOfStock}
            onClick={addToCartHandler}
          >
            {added ? (
              <>
                <i className="fa fa-check"></i> Added
              </>
            ) : (
              <>
                <i className="fa fa-shopping-bag"></i> Add
              </>
            )}
          </button>
        </div>
      </div>

      {quickView && (
        <QuickView product={product} onClose={() => setQuickView(false)} />
      )}
    </div>
  );
}
