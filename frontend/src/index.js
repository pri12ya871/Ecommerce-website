import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import store from './store';

// In production the frontend (Vercel) and API (Render) live on different
// hosts, so point axios at the backend via REACT_APP_API_URL. Left blank
// for local dev, where CRA's proxy forwards /api to localhost:5000.
Axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
reportWebVitals();
