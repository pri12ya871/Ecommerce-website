import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { setSearch } from '../actions/productActions';
import { formatPrice, imgSrc, onImgError } from '../utils';

export default function CartScreen(props) {
  const productId = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split('=')[1])
    : 1;
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userSignin);

  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const checkoutHandler = () => {
    props.history.push(userInfo ? '/shipping' : '/signin');
  };

  const itemCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const subtotal = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 50 ? 0 : 6.99;

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="empty-state fade-up">
          <i className="fa fa-shopping-bag"></i>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Explore our best sellers and deals to get started.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: '2.8rem' }}>
        Shopping Cart{' '}
        <span style={{ color: 'var(--muted)', fontSize: '1.6rem', fontWeight: 500 }}>
          ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </h1>
      <div className="row top" style={{ gap: '2.4rem', alignItems: 'flex-start' }}>
        <div className="col-2">
          {cartItems.map((item) => (
            <div className="cart-item fade-up" key={item.product}>
              <Link to={`/product/${item.product}`}>
                <img src={imgSrc(item.image)} onError={onImgError} alt={item.name} />
              </Link>
              <div>
                <Link className="ci-name" to={`/product/${item.product}`}>
                  {item.name}
                </Link>
                <div className="ci-controls">
                  <div className="qty-stepper">
                    <button
                      className="link-plain"
                      aria-label="Decrease"
                      onClick={() =>
                        item.qty > 1 &&
                        dispatch(addToCart(item.product, item.qty - 1))
                      }
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      className="link-plain"
                      aria-label="Increase"
                      onClick={() =>
                        item.qty < item.countInStock &&
                        dispatch(addToCart(item.product, item.qty + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-danger-soft btn-sm"
                    onClick={() => dispatch(removeFromCart(item.product))}
                  >
                    <i className="fa fa-trash-o"></i> Remove
                  </button>
                </div>
              </div>
              <div className="ci-price">
                {formatPrice(item.price * item.qty)}
                {item.qty > 1 && (
                  <div style={{ fontSize: '1.2rem', color: 'var(--muted)', fontWeight: 500 }}>
                    {formatPrice(item.price)} each
                  </div>
                )}
              </div>
            </div>
          ))}
          <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 600 }}>
            <i className="fa fa-long-arrow-left"></i> Continue shopping
          </Link>
        </div>

        <div className="col-1">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="sum-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="sum-row">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="success">FREE</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: '1.25rem', color: 'var(--muted)', margin: '0.4rem 0' }}>
                Add {formatPrice(50 - subtotal)} more for free shipping
              </p>
            )}
            <div className="sum-row total">
              <span>Total</span>
              <span>{formatPrice(subtotal + shipping)}</span>
            </div>
            <button
              type="button"
              onClick={checkoutHandler}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '1.6rem' }}
            >
              Proceed to Checkout <i className="fa fa-long-arrow-right"></i>
            </button>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                color: 'var(--muted)',
                margin: '1.2rem 0 0',
              }}
            >
              <i className="fa fa-lock"></i> Secure checkout · 30-day returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
