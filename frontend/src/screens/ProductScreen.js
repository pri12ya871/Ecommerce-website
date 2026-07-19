import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsProduct, listProducts, setSearch } from '../actions/productActions';
import { addToWishList, removeFromWishList } from '../actions/wishlistActions';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import ProductRail from '../components/ProductRail';
import Product from '../components/Product';
import SkeletonGrid from '../components/SkeletonGrid';
import { formatPrice, imgSrc, onImgError, discountOf } from '../utils';

export default function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    dispatch(detailsProduct(productId));
    dispatch(listProducts());
    setQty(1);
    setActiveImg(0);
    setTab('description');
    window.scrollTo(0, 0);
  }, [dispatch, productId]);

  const { loading, error, product } = useSelector((state) => state.productDetails);
  const { products } = useSelector((state) => state.productList);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const wished = product && wishlistItems.some((w) => w.product === product._id);

  const similar = useMemo(() => {
    if (!products || !product) return [];
    return products
      .filter((p) => p.category === product.category && p._id !== product._id)
      .slice(0, 10);
  }, [products, product]);

  const boughtTogether = useMemo(() => {
    if (!products || !product) return [];
    return products
      .filter((p) => p.brand === product.brand && p._id !== product._id)
      .concat(
        products.filter(
          (p) => p.subCategory === product.subCategory && p._id !== product._id
        )
      )
      .filter((p, i, arr) => arr.findIndex((x) => x._id === p._id) === i)
      .slice(0, 4);
  }, [products, product]);

  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };

  if (loading) {
    return (
      <div className="page">
        <SkeletonGrid count={4} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="page">
        <MessageBox variant="danger">{error}</MessageBox>
      </div>
    );
  }
  if (!product) return null;

  const discount = discountOf(product);
  const outOfStock = product.countInStock === 0;
  const lowStock = !outOfStock && product.countInStock <= 5;
  const images =
    product.images && product.images.length > 0 ? product.images : [product.image];
  const specs = product.specs || {};
  const specEntries = Object.entries({
    brand: product.brand,
    category: product.category,
    ...specs,
  }).filter(([, v]) => v !== undefined && v !== null && v !== '');

  const maxQty = Math.min(product.countInStock, 10);

  return (
    <div className="page">
      <div className="results-bar">
        <span className="crumb">
          <Link to="/">Home</Link> /{' '}
          <Link to={`/search/category/${encodeURIComponent(product.category || '')}`}>
            {product.category}
          </Link>{' '}
          / <b>{product.name}</b>
        </span>
      </div>

      <div className="pd-wrap">
        {/* ---------- gallery ---------- */}
        <div className="pd-gallery">
          <div className="pd-main-img" title="Hover to zoom">
            <img
              src={imgSrc(images[activeImg])}
              onError={onImgError}
              alt={product.name}
            />
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb link-plain ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={imgSrc(img)} onError={onImgError} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- info ---------- */}
        <div className="pd-info">
          <span className="pcard-brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <Rating rating={product.rating} numReviews={product.numReviews} />

          <div className="pd-price">
            <span className="price">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="price-old">{formatPrice(product.oldPrice)}</span>
            )}
            {discount > 0 && <span className="price-off">Save {discount}%</span>}
          </div>

          <p className="pd-desc">{product.description}</p>

          <div className="pd-buybox">
            <span
              className={`pcard-stock ${outOfStock ? 'out' : lowStock ? 'low' : 'in'}`}
              style={{ fontSize: '1.4rem' }}
            >
              <i
                className={`fa ${outOfStock ? 'fa-times-circle' : 'fa-check-circle'}`}
              ></i>{' '}
              {outOfStock
                ? 'Currently out of stock'
                : lowStock
                ? `Hurry — only ${product.countInStock} left in stock`
                : `In stock (${product.countInStock} available)`}
            </span>

            {!outOfStock && (
              <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="qty-stepper">
                  <button className="link-plain" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
                    −
                  </button>
                  <span>{qty}</span>
                  <button className="link-plain" onClick={() => setQty(Math.min(maxQty, qty + 1))} aria-label="Increase">
                    +
                  </button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={addToCartHandler}>
                  <i className="fa fa-shopping-bag"></i> Add to Cart
                </button>
                <button
                  className={`btn btn-outline btn-lg ${wished ? 'active' : ''}`}
                  onClick={() =>
                    wished
                      ? dispatch(removeFromWishList(product._id))
                      : dispatch(addToWishList(product._id))
                  }
                >
                  <i
                    className={wished ? 'fa fa-heart' : 'fa fa-heart-o'}
                    style={{ color: wished ? '#e11d48' : undefined }}
                  ></i>{' '}
                  {wished ? 'Wishlisted' : 'Wishlist'}
                </button>
              </div>
            )}
          </div>

          <div className="pd-meta">
            <div className="pd-meta-row">
              <i className="fa fa-truck"></i>
              <span>
                <b>Free delivery</b> on orders over $50 —{' '}
                {specs.shipping || 'ships in 1–2 business days'}
              </span>
            </div>
            <div className="pd-meta-row">
              <i className="fa fa-refresh"></i>
              <span>{specs.returnPolicy || '30-day easy returns'}</span>
            </div>
            <div className="pd-meta-row">
              <i className="fa fa-shield"></i>
              <span>{specs.warranty || 'Standard manufacturer warranty'}</span>
            </div>
            <div className="pd-meta-row">
              <i className="fa fa-lock"></i>
              <span>Secure checkout with PayPal & major cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- tabs ---------- */}
      <div className="pd-tabs">
        {['description', 'specifications', 'reviews'].map((t) => (
          <button
            key={t}
            className={`pd-tab link-plain ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'reviews'
              ? `Reviews (${(product.reviews || []).length})`
              : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'description' && (
        <div style={{ maxWidth: '72rem' }}>
          <p className="pd-desc">{product.description}</p>
          {product.tags && product.tags.length > 0 && (
            <p style={{ marginTop: '1.6rem' }}>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-block',
                    background: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    borderRadius: '999px',
                    padding: '0.4rem 1.2rem',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginRight: '0.8rem',
                    marginBottom: '0.8rem',
                    textTransform: 'capitalize',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </p>
          )}
        </div>
      )}

      {tab === 'specifications' && (
        <table className="spec-table">
          <tbody>
            {specEntries.map(([key, value]) => (
              <tr key={key}>
                <td>{key.replace(/([A-Z])/g, ' $1')}</td>
                <td>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'reviews' && (
        <div>
          <div className="review-summary">
            <div>
              <span className="big">{Number(product.rating).toFixed(1)}</span>
            </div>
            <div>
              <Rating rating={product.rating} compact />
              <p style={{ margin: '0.4rem 0 0', color: 'var(--muted)', fontSize: '1.35rem' }}>
                Based on {product.numReviews} ratings
              </p>
            </div>
          </div>
          {(product.reviews || []).length === 0 ? (
            <MessageBox>No written reviews yet.</MessageBox>
          ) : (
            product.reviews.map((rev, i) => (
              <div className="review-card" key={i}>
                <div className="rev-head">
                  <b>
                    <i className="fa fa-user-circle-o" style={{ color: 'var(--faint)', marginRight: '0.6rem' }}></i>
                    {rev.name}
                  </b>
                  <span className="rev-date">
                    {rev.date ? new Date(rev.date).toLocaleDateString() : ''}
                  </span>
                </div>
                <Rating rating={rev.rating} compact />
                <p>{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------- frequently bought together ---------- */}
      {boughtTogether.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <span className="kicker">Pairs well with</span>
              <h2>Frequently Bought Together</h2>
            </div>
          </div>
          <div className="pgrid">
            {boughtTogether.map((p) => (
              <Product key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- similar ---------- */}
      <ProductRail
        kicker="More to explore"
        title="Similar Products"
        products={similar}
        link={`/search/category/${encodeURIComponent(product.category || '')}`}
      />
    </div>
  );
}