import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { formatPrice, imgSrc, onImgError } from '../utils';

export default function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart);
  if (!cart.paymentMethod) {
    props.history.push('/payment');
  }
  const { loading, success, error, order } = useSelector(
    (state) => state.orderCreate
  );

  const toPrice = (num) => Number(num.toFixed(2));
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 50 ? toPrice(0) : toPrice(6.99);
  cart.taxPrice = toPrice(0.08 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const dispatch = useDispatch();
  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
  };

  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, order, props.history, success]);

  return (
    <div className="page">
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="row top" style={{ gap: '2.4rem', alignItems: 'flex-start' }}>
        <div className="col-2">
          <div className="summary-card" style={{ marginBottom: '1.6rem' }}>
            <h2>
              <i className="fa fa-map-marker" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
              Shipping Address
            </h2>
            <p style={{ margin: 0, fontSize: '1.4rem', color: 'var(--ink-2)' }}>
              <strong>{cart.shippingAddress.fullName}</strong>
              <br />
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="summary-card" style={{ marginBottom: '1.6rem' }}>
            <h2>
              <i className="fa fa-credit-card" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
              Payment Method
            </h2>
            <p style={{ margin: 0, fontSize: '1.4rem', color: 'var(--ink-2)' }}>
              {cart.paymentMethod}
            </p>
          </div>

          <div className="summary-card">
            <h2>
              <i className="fa fa-shopping-bag" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
              Order Items ({cart.cartItems.length})
            </h2>
            {cart.cartItems.map((item) => (
              <div
                key={item.product}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '6rem 1fr auto',
                  gap: '1.4rem',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <img
                  src={imgSrc(item.image)}
                  onError={onImgError}
                  alt={item.name}
                  style={{
                    width: '6rem',
                    height: '6rem',
                    objectFit: 'contain',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-s)',
                    padding: '0.4rem',
                    background: '#fff',
                  }}
                />
                <Link to={`/product/${item.product}`} style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '1.4rem' }}>
                  {item.name}
                </Link>
                <span style={{ fontSize: '1.4rem', color: 'var(--ink-2)' }}>
                  {item.qty} × {formatPrice(item.price)} ={' '}
                  <b>{formatPrice(item.qty * item.price)}</b>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-1">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="sum-row">
              <span>Items</span>
              <span>{formatPrice(cart.itemsPrice)}</span>
            </div>
            <div className="sum-row">
              <span>Shipping</span>
              <span>
                {cart.shippingPrice === 0 ? (
                  <span className="success">FREE</span>
                ) : (
                  formatPrice(cart.shippingPrice)
                )}
              </span>
            </div>
            <div className="sum-row">
              <span>Tax (8%)</span>
              <span>{formatPrice(cart.taxPrice)}</span>
            </div>
            <div className="sum-row total">
              <span>Total</span>
              <span>{formatPrice(cart.totalPrice)}</span>
            </div>
            <button
              type="button"
              onClick={placeOrderHandler}
              className="btn btn-primary btn-lg btn-block"
              style={{ marginTop: '1.6rem' }}
              disabled={cart.cartItems.length === 0}
            >
              <i className="fa fa-check-circle"></i> Place Order
            </button>
            {loading && <LoadingBox />}
            {error && <MessageBox variant="danger">{error}</MessageBox>}
          </div>
        </div>
      </div>
    </div>
  );
}
