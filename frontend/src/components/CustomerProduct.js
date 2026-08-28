import { imgSrc, onImgError, formatPrice } from '../utils';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Rating from './Rating';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductChosen, setSearch } from '../actions/productActions';
import { deleteProductCustomer } from '../actions/productActions';
import { listCustomerProducts } from '../actions/productActions';

export default function CustomerProduct(props) {
    const { product } = props;
    const dispatch = useDispatch();

    const customerSignin = useSelector((state) => state.customerSignin);
    const { customerInfo } = customerSignin;

    const history = useHistory();

    function editProduct(productId) {
        dispatch(updateProductChosen(productId));
        history.push(`/cutomerupdateproduct/${productId}`);
    }

    function deleteProd(productId) {
        dispatch(deleteProductCustomer(productId));
        dispatch(listCustomerProducts(customerInfo.name));
        alert("Product is being deleted, Press ok");
        history.push(`/customerproductlist`);

    }

    return (
        <div className="pcard">
            <Link to={`/adminproduct/${product._id}`} className="pcard-media">
                <img
                    src={imgSrc(product.image)}
                    onError={onImgError}
                    alt={product.name}
                    loading="lazy"
                />
            </Link>
            <div className="pcard-body">
                <span className="pcard-brand">{product.brand}</span>
                <Link to={`/adminproduct/${product._id}`}>
                    <h3 className="pcard-name">{product.name}</h3>
                </Link>
                <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                ></Rating>
                <div className="pcard-priceline">
                    <span className="price">{formatPrice(product.price)}</span>
                </div>
                <span className={`pcard-stock ${product.countInStock === 0 ? 'out' : product.countInStock <= 5 ? 'low' : 'in'}`}>
                    {product.countInStock === 0
                        ? 'Out of stock'
                        : `${product.countInStock} in stock`}
                </span>
                <div className="pcard-actions">
                    <button onClick={() => { editProduct(product._id) }} className="btn btn-outline" type="button">
                        <i className="fa fa-pencil"></i> Edit
                    </button>
                    <button onClick={() => { deleteProd(product._id) }} className="btn btn-danger-soft" type="button">
                        <i className="fa fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}