import React from 'react';
import { Link } from 'react-router-dom';
import Product from './Product';

// Horizontal scroll rail of product cards with a section header.
export default function ProductRail({ kicker, title, products, link, linkLabel }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="section">
      <div className="section-head">
        <div>
          {kicker && <span className="kicker">{kicker}</span>}
          <h2>{title}</h2>
        </div>
        {link && (
          <Link className="see-all" to={link}>
            {linkLabel || 'View all'} <i className="fa fa-long-arrow-right"></i>
          </Link>
        )}
      </div>
      <div className="rail">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
