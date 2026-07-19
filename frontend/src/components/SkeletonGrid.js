import React from 'react';

// Loading placeholder that mirrors the product grid/rail layout.
export default function SkeletonGrid({ count = 8, rail = false }) {
  return (
    <div className={rail ? 'rail' : 'pgrid'}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton sk-img"></div>
          <div className="sk-body">
            <div className="skeleton sk-line" style={{ width: '40%' }}></div>
            <div className="skeleton sk-line" style={{ width: '90%' }}></div>
            <div className="skeleton sk-line" style={{ width: '60%' }}></div>
            <div className="skeleton sk-line" style={{ width: '50%', height: '2rem' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
