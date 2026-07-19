import { model } from '../db.js';

const User = model('User', {
  defaults: { isAdmin: false },
});

export default User;
