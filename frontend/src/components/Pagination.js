/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Pagination = ({ postsPerPage, totalPosts, paginate, screen }) => {
  const pageNumbers = [];


  const userSignin = useSelector((state) => state.userSignin);
  const { adminInfo, userInfo } = userSignin;

  const customerSignin = useSelector((state) => state.customerSignin);
  const { customerInfo } = customerSignin;

  const search = localStorage.getItem('search')


  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul style={{}} className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            {(customerInfo) ?
              (screen === "customerRequestStatus") ?
                <Link to="/customerRequestStatus"><span onClick={() => paginate(number)} className='page-link'>
                  {number}
                </span></Link>
                :
                <Link to="/customerproductlist"><span onClick={() => paginate(number)} className='page-link'>
                  {number}
                </span></Link>
              : (adminInfo) ?
                (search === "done") ?
                  (screen === "requestedProducts") ?
                    <Link to="/requestadmin"><span onClick={() => paginate(number)} className='page-link'>
                      {number}
                    </span></Link>
                    :
                    <Link to="/ordersummary"><span onClick={() => paginate(number)} className='page-link'>
                      {number}
                    </span></Link>
                  :
                  <Link to="/adminproductlist"><span onClick={() => paginate(number)} className='page-link'>
                    {number}
                  </span></Link>
                : (screen === "sortScreen") ?
                  <Link to="/sort/:sortValue"><span onClick={() => paginate(number)} className='page-link'>
                    {number}
                  </span></Link>
                  :
                  <Link to="/"><span onClick={() => paginate(number)} className='page-link'>
                    {number}
                  </span></Link>
            }
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;