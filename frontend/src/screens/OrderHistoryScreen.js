import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listOrderMine } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { setSearch } from '../actions/productActions';
import { formatPrice } from '../utils';

const pill = (ok, label) => (
  <span
    style={{
      display: 'inline-block',
      padding: '0.3rem 1rem',
      borderRadius: '999px',
      fontSize: '1.2rem',
      fontWeight: 700,
      background: ok ? 'var(--success-soft)' : 'var(--danger-soft)',
      color: ok ? 'var(--success)' : 'var(--danger)',
    }}
  >
    {label}
  </span>
);

export default function OrderHistoryScreen(props) {
  const { loading, error, orders } = useSelector((state) => state.orderMineList);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    dispatch(listOrderMine());
  }, [dispatch]);

  return (
    <div className="page">
      <h1 style={{ fontSize: '2.8rem' }}>My Orders</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length === 0 ? (
        <div className="empty-state fade-up">
          <i className="fa fa-cube"></i>
          <h2>No orders yet</h2>
          <p>When you place your first order, it will show up here.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace' }}>
                    #{order._id.substring(0, 10)}…
                  </td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>
                    <b>{formatPrice(order.totalPrice)}</b>
                  </td>
                  <td>
                    {order.isPaid
                      ? pill(true, `Paid ${order.paidAt ? String(order.paidAt).substring(0, 10) : ''}`)
                      : pill(false, 'Unpaid')}
                  </td>
                  <td>
                    {order.isDelivered
                      ? pill(true, `Delivered`)
                      : pill(false, 'In transit')}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => props.history.push(`/order/${order._id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
