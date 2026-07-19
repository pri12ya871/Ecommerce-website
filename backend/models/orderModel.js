import { model } from '../db.js';

const Order = model('Order', {
  defaults: { isPaid: false, isDelivered: false },
});

export default Order;
