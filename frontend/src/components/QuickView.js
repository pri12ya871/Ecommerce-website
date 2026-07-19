import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { formatPrice, imgSrc, onImgError, discountOf } from '../utils';
import Rating from './Rating';

export default function QuickView({ product, onClose }) {
  const dispatch = useDispatch();
  const discount = discountOf(product);
  const outOfStock = product.countInStock === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close link-plain" onClick={onClose} aria-label="Close">
          <i className="fa fa-times"></i>
        </button>

        <div className="modal-img">
          <img src={imgSrc(product.image)} onError={onImgError} alt={product.name} />
        </div>

        <div>
          <span className="pcard-brand">{product.brand}</span>
          <h2 style={{ fontSize: '2.2rem', margin: '0.6rem 0 1rem' }}>
            {product.name}
          </h2>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <div className="pd-price">
            <span className="price">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="price-old">{formatPrice(product.oldPrice)}</span>
            )}
            {discount > 0 && <span className="price-off">{discount}% off</span>}
          </div>
          <p className="pd-desc" style={{ marginTop: 0 }}>
            {product.description}
          </p>
          <p
            className={`pcard-stock ${outOfStock ? 'out' : 'in'}`}
            style={{ fontSize: '1.35rem' }}
          >
            {outOfStock
              ? 'Out of stock'
              : `In stock — ${product.countInStock} available`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.6rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              disabled={outOfStock}
              onClick={() => {
                dispatch(addToCart(product._id, 1));
                onClose();
              }}
            >
              <i className="fa fa-shopping-bag"></i> Add to Cart
            </button>
            <Link to={`/product/${product._id}`} className="btn btn-outline btn-lg">
              Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
