import { imgSrc, onImgError, formatPrice } from '../utils';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Rating from './Rating';
import { useDispatch } from 'react-redux';
import { updateProductChosen, setSearch } from '../actions/productActions';
import { deleteProduct } from '../actions/productActions';
import { listProducts } from '../actions/productActions';

export default function AdminProduct(props) {
    const dispatch = useDispatch();
    const { product } = props;


    const history = useHistory();

    function editProduct(productId) {
        dispatch(updateProductChosen(productId));
        history.push(`/adminupdateproduct/${productId}`);
    }

    function deleteProd(productId) {
        dispatch(deleteProduct(productId));
        dispatch(listProducts());
        alert("Product is being deleted, Press ok");
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