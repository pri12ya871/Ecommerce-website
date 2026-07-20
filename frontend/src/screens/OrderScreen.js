import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import jsPDF from 'jspdf';
import { formatPrice, imgSrc, onImgError } from '../utils';

export default function OrderScreen(props) {
  const orderId = props.match.params.id;

  const [sdkReady, setSdkReady] = useState(false);
  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const { userInfo } = useSelector((state) => state.userSignin);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = useSelector((state) => state.orderPay);

  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await Axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay || (order && order._id !== orderId)) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(detailsOrder(orderId));
    } else {
      if (!order.isPaid) {
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
      }
    }
  }, [dispatch, order, orderId, sdkReady, successPay]);

  const [bag, setBag] = useState([]);

  useEffect(() => {
    if (order) {
      setBag(order.orderItems);
    }
  }, [order]);

  useEffect(() => {
    if (bag) {
      setText(
        `Hi ${userInfo.name}, thank you for shopping at ICON Store. We're preparing your order with ${bag.length} item(s): ${bag
          .map((b) => b.name)
          .join(', ')} — it will be delivered within 7 days.`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bag]);

  if (order) {
    let currentTime = new Date();
    let paidTime = new Date(order.paidAt);
    var days = (currentTime - paidTime) / (1000 * 3600 * 24);
  }

  const [recipient] = useState(userInfo.contact);
  const [textmessage, setText] = useState('');

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
    Axios.get('/send-text', { params: { recipient, textmessage } })
      .catch((err) => console.error(err));
  };

  function cancelOrder(id) {
    Axios.delete(`/api/orders/delete/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    })
      .then((res) => console.log('result :', res.data))
      .catch((err) => console.log(err));
    alert('Order cancelled successfully');
    props.history.push('/orderhistory');
  }

  function generatePDF() {
    var doc = new jsPDF('l', 'mm', [1340, 740]);
    doc.html(document.querySelector('#content'), {
      callback: function (pdf) {
        pdf.save('Bill.pdf');
      },
    });
  }

  return loading ? (
    <div className="page">
      <LoadingBox />
    </div>
  ) : error ? (
    <div className="page">
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : (
    <div className="page" id="content">
      <h1 style={{ fontSize: '2.4rem' }}>
        Order <span style={{ color: 'var(--muted)', fontFamily: 'monospace' }}>#{order._id}</span>
      </h1>
      <div className="row top" style={{ gap: '2.4rem', alignItems: 'flex-start' }}>
        <div className="col-2">
          <div className="summary-card" style={{ marginBottom: '1.6rem' }}>
            <h2>
              <i className="fa fa-map-marker" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
              Shipping
            </h2>
            <p style={{ margin: '0 0 1rem', fontSize: '1.4rem', color: 'var(--ink-2)' }}>
              <strong>{order.shippingAddress.fullName}</strong>
              <br />
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <MessageBox variant="success">
                Delivered at {order.deliveredAt}
              </MessageBox>
            ) : (
              <MessageBox variant="info">
                <i className="fa fa-truck"></i> In transit — estimated delivery
                within 7 days
              </MessageBox>
            )}
          </div>

          <div className="summary-card" style={{ marginBottom: '1.6rem' }}>
            <h2>
              <i className="fa fa-credit-card" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
              Payment
            </h2>
            <p style={{ margin: '0 0 1rem', fontSize: '1.4rem', color: 'var(--ink-2)' }}>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <MessageBox variant="success">Paid at {order.paidAt}</MessageBox>
            ) : (
              <MessageBox variant="danger">Not paid yet</MessageBox>
            )}
            {order.isPaid ? (
              days < 30 ? (
                <div data-html2canvas-ignore="true" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button onClick={generatePDF} className="btn btn-outline btn-sm">
                    <i className="fa fa-file-pdf-o"></i> Download Invoice
                  </button>
                  <button onClick={() => cancelOrder(orderId)} className="btn btn-danger-soft btn-sm">
                    <i className="fa fa-times-circle"></i> Cancel Order
                  </button>
                  <span style={{ fontSize: '1.25rem', color: 'var(--muted)' }}>
                    Free cancellation for {Number((30 - days).toFixed(0))} more days
                  </span>
                </div>
              ) : (
                <>
                  <p data-html2canvas-ignore="true" style={{ fontSize: '1.3rem', color: 'var(--muted)' }}>
                    The 30-day cancellation window for this order has expired.
                  </p>
                  <button data-html2canvas-ignore="true" onClick={generatePDF} className="btn btn-outline btn-sm">
                    <i className="fa fa-file-pdf-o"></i> Download Invoice
                  </button>
                </>
              )
            ) : (
              <div data-html2canvas-ignore="true">
                <button onClick={() => cancelOrder(orderId)} className="btn btn-danger-soft btn-sm">
                  <i className="fa fa-times-circle"></i> Cancel Order
                </button>
              </div>
            )}
          </div>

          <div className="summary-card">
            <h2>
              <i className="fa fa-shopping-bag" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
              Order Items
            </h2>
            {order.orderItems.map((item) => (
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
              <span>{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="sum-row">
              <span>Shipping</span>
              <span>
                {order.shippingPrice === 0 ? (
                  <span className="success">FREE</span>
                ) : (
                  formatPrice(order.shippingPrice)
                )}
              </span>
            </div>
            <div className="sum-row">
              <span>Tax</span>
              <span>{formatPrice(order.taxPrice)}</span>
            </div>
            <div className="sum-row total">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
            {!order.isPaid && order.paymentMethod === 'PayPal' && (
              <div style={{ marginTop: '1.6rem' }}>
                {!sdkReady ? (
                  <LoadingBox />
                ) : (
                  <>
                    {errorPay && (
                      <MessageBox variant="danger">{errorPay}</MessageBox>
                    )}
                    {loadingPay && <LoadingBox />}
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    ></PayPalButton>
                  </>
                )}
              </div>
            )}
            {!order.isPaid && order.paymentMethod !== 'PayPal' && (
              <MessageBox variant="info">
                Pay {formatPrice(order.totalPrice)} in cash on delivery.
              </MessageBox>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
