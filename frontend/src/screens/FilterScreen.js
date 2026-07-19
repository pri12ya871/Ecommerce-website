import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import ShopResults from '../components/ShopResults';
import { setSearch } from '../actions/productActions';

export default function FilterScreen(props) {
  const dispatch = useDispatch();
  const filterValue = (props.location.state && props.location.state.response) || [];
  const option = props.match.params.option;

  const [filterData, setFilterData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('search', 'done');
    dispatch(setSearch());
    const data = JSON.stringify(filterValue);
    if (option === 'category' || option === 'brand') {
      Axios.get(`/api/products/filter/${option}/${encodeURIComponent(data)}`)
        .then((res) => setFilterData(res.data.data))
        .catch((err) => setError(err.message));
    } else {
      setFilterData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, JSON.stringify(filterValue)]);

  const crumb =
    filterValue.length > 0
      ? `${option === 'brand' ? 'Brands' : 'Categories'}: ${filterValue.join(', ')}`
      : 'Filtered products';

  return (
    <ShopResults
      title={crumb}
      crumb={crumb}
      loading={filterData === null && !error}
      error={error}
      products={filterData || []}
    />
  );
}
