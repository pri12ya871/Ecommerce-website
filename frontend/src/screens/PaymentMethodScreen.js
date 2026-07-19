import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const METHODS = [
  {
    value: 'PayPal',
    icon: 'fa-cc-paypal',
    label: 'PayPal',
    hint: 'Pay securely with your PayPal account or card',
  },
  {
    value: 'Cash On Delivery',
    icon: 'fa-money',
    label: 'Cash on Delivery',
    hint: 'Pay in cash when your order arrives',
  },
];

export default function PaymentMethodScreen(props) {
  const { shippingAddress } = useSelector((state) => state.cart);
  if (!shippingAddress.address) {
    props.history.push('/shipping');
  }
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    props.history.push('/placeorder');
  };

  return (
    <div className="page">
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <form className="form fade-up" onSubmit={submitHandler}>
        <div>
          <h1>Payment Method</h1>
        </div>
        {METHODS.map((m) => (
          <div key={m.value} style={{ marginBottom: '1.2rem' }}>
            <label
              className="check-row"
              style={{
                border: `1.5px solid ${paymentMethod === m.value ? 'var(--primary)' : 'var(--line)'}`,
                borderRadius: 'var(--radius)',
                padding: '1.4rem 1.6rem',
                background: paymentMethod === m.value ? 'var(--primary-soft)' : 'var(--surface)',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="radio"
                value={m.value}
                name="paymentMethod"
                checked={paymentMethod === m.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '1.8rem', height: '1.8rem', padding: 0 }}
              ></input>
              <i className={`fa ${m.icon}`} style={{ fontSize: '2.4rem', color: 'var(--primary)', margin: '0 0.6rem' }}></i>
              <span>
                <b style={{ display: 'block', fontSize: '1.45rem' }}>{m.label}</b>
                <span style={{ fontSize: '1.25rem', color: 'var(--muted)' }}>{m.hint}</span>
              </span>
            </label>
          </div>
        ))}
        <div>
          <button className="btn btn-primary btn-lg btn-block" type="submit">
            Continue <i className="fa fa-long-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
