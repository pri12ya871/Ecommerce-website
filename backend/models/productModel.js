import { model } from '../db.js';

const Product = model('Product', {
  defaults: { customer: 'admin', requestStatus: false },
});

export default Product;
