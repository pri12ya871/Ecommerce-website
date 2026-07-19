import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function SearchBox() {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [option, setOption] = useState('name');

  const submitHandler = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    history.push(`/search/${option}/${encodeURIComponent(search.trim())}`);
  };

  return (
    <form className="searchbar" onSubmit={submitHandler}>
      <select
        aria-label="Search scope"
        value={option}
        onChange={(e) => setOption(e.target.value)}
      >
        <option value="name">All</option>
        <option value="brand">Brand</option>
        <option value="category">Category</option>
      </select>
      <input
        type="text"
        value={search}
        placeholder="Search products, brands and more…"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="search-btn link-plain" type="submit" aria-label="Search">
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}
