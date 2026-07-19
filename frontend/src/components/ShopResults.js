import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Product from './Product';
import FilterBox from './FilterBox';
import SkeletonGrid from './SkeletonGrid';
import MessageBox from './MessageBox';

const PAGE_SIZE = 12;

const SORTERS = {
  relevance: null,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'rating-desc': (a, b) => b.rating - a.rating,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'discount-desc': (a, b) => (b.discount || 0) - (a.discount || 0),
};

// Shared results layout: filter sidebar + toolbar (sort, stock toggle) + grid + pagination.
export default function ShopResults({ title, crumb, loading, error, products }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('relevance');
  const [inStockOnly, setInStockOnly] = useState(false);

  const visible = useMemo(() => {
    let list = products || [];
    if (inStockOnly) list = list.filter((p) => p.countInStock > 0);
    const sorter = SORTERS[sort];
    if (sorter) list = [...list].sort(sorter);
    return list;
  }, [products, sort, inStockOnly]);

  const pageCount = Math.ceil(visible.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const pageItems = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="page">
      <div className="shop-layout">
        <FilterBox />
        <div>
          <div className="results-bar">
            <span className="crumb">
              <Link to="/">Home</Link> / <b>{crumb || title}</b>
              {!loading && !error && (
                <>
                  {' '}
                  · {visible.length} {visible.length === 1 ? 'product' : 'products'}
                </>
              )}
            </span>
            <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label className="check-row" style={{ padding: 0 }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setPage(1);
                  }}
                />
                In stock only
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                style={{ padding: '0.8rem 1.2rem', fontSize: '1.35rem' }}
                aria-label="Sort products"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="discount-desc">Biggest Discount</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : visible.length === 0 ? (
            <div className="empty-state">
              <i className="fa fa-search"></i>
              <h2>No products found</h2>
              <p>Try different keywords or clear some filters.</p>
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          ) : (
            <>
              <div className="pgrid">
                {pageItems.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              {pageCount > 1 && (
                <ul className="pagination">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <li key={n}>
                      <button
                        className="page-link link-plain"
                        style={
                          n === currentPage
                            ? {
                                background: 'var(--primary)',
                                color: '#fff',
                                borderColor: 'var(--primary)',
                              }
                            : undefined
                        }
                        onClick={() => {
                          setPage(n);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {n}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
