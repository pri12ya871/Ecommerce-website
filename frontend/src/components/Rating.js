import React from 'react';

// Star rating built from font-awesome glyphs.
// Props: rating (0–5), numReviews (optional), compact (hide count)
export default function Rating({ rating = 0, numReviews, compact }) {
  const stars = [1, 2, 3, 4, 5].map((i) => (
    <i
      key={i}
      className={
        rating >= i
          ? 'fa fa-star'
          : rating >= i - 0.5
          ? 'fa fa-star-half-o'
          : 'fa fa-star-o off'
      }
    ></i>
  ));

  return (
    <div className="pcard-rating">
      <span className="stars">{stars}</span>
      {!compact && numReviews !== undefined && (
        <span className="count">
          {Number(rating).toFixed(1)} ({numReviews})
        </span>
      )}
    </div>
  );
}
