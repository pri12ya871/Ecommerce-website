import React from 'react';

export default function LoadingBox() {
  return (
    <div className="loading">
      <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: '2rem' }}></i>
      Loading…
    </div>
  );
}
