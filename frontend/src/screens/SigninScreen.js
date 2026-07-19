import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin } from '../actions/userActions';
import { signinCustomer } from '../actions/customerActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { setSearch } from '../actions/productActions';

const DEMO_ACCOUNTS = [
  { role: 'User', email: 'demo@iconstore.com', password: 'demo123' },
  { role: 'Seller', email: 'seller@iconstore.com', password: 'seller123' },
  { role: 'Admin', email: 'admin@iconstore.com', password: 'admin123' },
];

export default function SigninScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signinAs, setSigninAs] = useState('User');

  const { adminInfo, userInfo, loading, error } = useSelector(
    (state) => state.userSignin
  );
  const { customerInfo, loading: loadingCustomer, error: errorCustomer } =
    useSelector((state) => state.customerSignin);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (signinAs === 'Admin') dispatch(signin(email, password, true));
    if (signinAs === 'User') dispatch(signin(email, password, false));
    if (signinAs === 'Customer') dispatch(signinCustomer(email, password));
  };

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    if (adminInfo) props.history.push('/adminproductlist');
    if (customerInfo) props.history.push('/customerproductlist');
    if (userInfo) props.history.push('/');
  }, [props.history, userInfo, customerInfo, adminInfo, dispatch]);

  const fillDemo = (acct) => {
    setEmail(acct.email);
    setPassword(acct.password);
    setSigninAs(acct.role === 'Seller' ? 'Customer' : acct.role);
  };

  return (
    <div className="page">
      <form className="form fade-up" onSubmit={submitHandler}>
        <div>
          <h1>Welcome back</h1>
          <p style={{ color: 'var(--muted)', margin: '-1rem 0 0.6rem', fontSize: '1.4rem' }}>
            Sign in to continue shopping
          </p>
        </div>
        {(loading || loadingCustomer) && <LoadingBox />}
        {(error || errorCustomer) && (
          <MessageBox variant="danger">{error || errorCustomer}</MessageBox>
        )}
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="SigninAs">Sign in as</label>
          <select
            id="SigninAs"
            name="SigninAs"
            value={signinAs}
            onChange={(e) => setSigninAs(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Customer">Seller</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <button className="btn btn-primary btn-lg btn-block" type="submit">
            Sign In
          </button>
        </div>
        <div>
          <div style={{ fontSize: '1.35rem' }}>
            New here? <Link to="/register">Create your account</Link>
          </div>
        </div>
        <div
          style={{
            background: 'var(--bg)',
            borderRadius: 'var(--radius-s)',
            padding: '1.4rem',
            marginBottom: 0,
          }}
        >
          <b style={{ fontSize: '1.25rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Demo accounts — click to fill
          </b>
          {DEMO_ACCOUNTS.map((acct) => (
            <button
              key={acct.role}
              type="button"
              className="link-plain"
              onClick={() => fillDemo(acct)}
              style={{
                display: 'block',
                background: 'none',
                border: 'none',
                padding: '0.5rem 0',
                fontSize: '1.3rem',
                color: 'var(--primary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <b>{acct.role}:</b>&nbsp;{acct.email} / {acct.password}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
