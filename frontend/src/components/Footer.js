import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from './Navbar';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <span className="brand">
            ICON<span style={{ color: '#818cf8' }}>.</span>
          </span>
          <p>
            ICON is a modern marketplace for electronics, fashion, beauty and
            home — curated products from brands you trust, delivered fast and
            backed by a 30-day return promise.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <i className="fa fa-youtube-play"></i>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link key={cat} to={`/search/category/${encodeURIComponent(cat)}`}>
              {cat}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/">About Us</Link>
          <Link to="/">Careers</Link>
          <Link to="/">Press</Link>
          <Link to="/">Sustainability</Link>
          <Link to="/signin">Sell on ICON</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/orderhistory">Track Order</Link>
          <Link to="/">Shipping & Delivery</Link>
          <Link to="/">Returns & Refunds</Link>
          <Link to="/">FAQs</Link>
          <Link to="/">Help Center</Link>
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <p>
            <i className="fa fa-map-marker"></i> 42 Market Street, Mumbai, IN
          </p>
          <p>
            <i className="fa fa-phone"></i> +91 98765 43210
          </p>
          <p>
            <i className="fa fa-envelope-o"></i> support@iconstore.com
          </p>
          <p>
            <i className="fa fa-clock-o"></i> Mon–Sat, 9:00 – 18:00
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 ICON Store. All rights reserved.</span>
        <span>
          <Link to="/" style={{ color: '#94a3b8' }}>Privacy Policy</Link>
          &nbsp;·&nbsp;
          <Link to="/" style={{ color: '#94a3b8' }}>Terms of Service</Link>
        </span>
        <div className="footer-pay" aria-label="Payment methods">
          <i className="fa fa-cc-visa"></i>
          <i className="fa fa-cc-mastercard"></i>
          <i className="fa fa-cc-paypal"></i>
          <i className="fa fa-cc-amex"></i>
        </div>
      </div>
    </footer>
  );
}
