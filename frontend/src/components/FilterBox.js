import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

const PRICE_PRESETS = [
  { label: 'Under $25', min: 0.01, max: 25 },
  { label: '$25 – $100', min: 25, max: 100 },
  { label: '$100 – $500', min: 100, max: 500 },
  { label: '$500 – $1500', min: 500, max: 1500 },
  { label: 'Over $1500', min: 1500, max: 100000 },
];

// Sidebar filters. Each group applies through the existing search/filter routes.
export default function FilterBox() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productList);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    // Load the catalog once so category/brand facets can be derived.
    if (!products || products.length === 0) {
      dispatch(listProducts());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const uniqueCategories = [...new Set((products || []).map((p) => p.category))].sort();
  const uniqueBrands = [...new Set((products || []).map((p) => p.brand))].sort();

  const toggle = (list, setList, value) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  const applyCategories = () => {
    if (categories.length > 0) {
      history.push({ pathname: '/filter/category', state: { response: categories } });
    }
  };

  const applyBrands = () => {
    if (brands.length > 0) {
      history.push({ pathname: '/filter/brand', state: { response: brands } });
    }
  };

  const applyPrice = (min, max) => {
    const lo = Number(min);
    const hi = Number(max);
    if (hi > 0 && hi >= lo) {
      history.push(`/searchByPrice/price/${lo}/${hi}`);
    }
  };

  return (
    <aside className="filterbox">
      <div className="filter-title">
        <h2>
          <i className="fa fa-sliders" style={{ marginRight: '0.8rem', color: 'var(--primary)' }}></i>
          Filters
        </h2>
      </div>

      <h3>Category</h3>
      <div className="filter-scroll">
        {uniqueCategories.map((cat) => (
          <label className="check-row" key={cat}>
            <input
              type="checkbox"
              checked={categories.includes(cat)}
              onChange={() => toggle(categories, setCategories, cat)}
            />
            {cat}
          </label>
        ))}
      </div>
      <button className="btn btn-outline btn-sm filter-apply" onClick={applyCategories}>
        Apply Categories
      </button>

      <h3>Brand</h3>
      <div className="filter-scroll">
        {uniqueBrands.map((brand) => (
          <label className="check-row" key={brand}>
            <input
              type="checkbox"
              checked={brands.includes(brand)}
              onChange={() => toggle(brands, setBrands, brand)}
            />
            {brand}
          </label>
        ))}
      </div>
      <button className="btn btn-outline btn-sm filter-apply" onClick={applyBrands}>
        Apply Brands
      </button>

      <h3>Price</h3>
      {PRICE_PRESETS.map((preset) => (
        <label className="check-row" key={preset.label}>
          <input
            type="checkbox"
            checked={false}
            onChange={() => applyPrice(preset.min, preset.max)}
          />
          {preset.label}
        </label>
      ))}
      <div className="price-inputs" style={{ marginTop: '1rem' }}>
        <input
          type="number"
          min="0"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span style={{ color: 'var(--faint)' }}>–</span>
        <input
          type="number"
          min="0"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <button
        className="btn btn-outline btn-sm filter-apply"
        onClick={() => applyPrice(minPrice || 0, maxPrice)}
      >
        Apply Price
      </button>

      <h3>Rating</h3>
      {[4, 3, 2, 1].map((r) => (
        <label className="check-row" key={r}>
          <input
            type="checkbox"
            checked={false}
            onChange={() => history.push(`/search/rating/${r}`)}
          />
          <span className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <i key={i} className={i <= r ? 'fa fa-star' : 'fa fa-star-o off'}></i>
            ))}
          </span>
          &nbsp;& up
        </label>
      ))}
    </aside>
  );
}
