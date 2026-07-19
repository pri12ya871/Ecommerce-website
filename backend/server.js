import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import bcrypt from 'bcryptjs';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import customerRouter from './routers/customerRouter.js';
import orderRouter from './routers/orderRouter.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import Customer from './models/customerModel.js';
import data from './data.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/api/users', userRouter);
app.use('/api/customers', customerRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.get('/', (req, res) => {
  res.send('Icon Store API is running');
});

// SMS notifications are optional — only wired up when real Twilio
// credentials are configured; otherwise the endpoint is a friendly no-op.
app.get('/send-text', async (req, res) => {
  res.send('OK');
  const { accountSid, authToken, sender } = process.env;
  if (!accountSid || !authToken || accountSid.startsWith('ACaaaa')) return;
  try {
    const { default: twilio } = await import('twilio');
    const client = twilio(accountSid, authToken);
    const { recipient, textmessage } = req.query;
    await client.messages.create({
      body: textmessage,
      to: `+91${recipient}`,
      from: sender,
    });
  } catch (err) {
    console.error('Twilio send failed:', err.message);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Seed the store on first run so the app works out of the box.
async function seed() {
  const products = await Product.find({});
  if (products.length === 0) {
    await Product.insertMany(data.products);
    console.log(`Seeded ${data.products.length} products`);
  }
  const admin = await User.findOne({ email: 'admin@iconstore.com' });
  if (!admin) {
    await User.create({
      name: 'Admin',
      email: 'admin@iconstore.com',
      contact: 9999999999,
      password: bcrypt.hashSync('admin123', 8),
      isAdmin: true,
    });
    await User.create({
      name: 'Demo User',
      email: 'demo@iconstore.com',
      contact: 8888888888,
      password: bcrypt.hashSync('demo123', 8),
      isAdmin: false,
    });
    await Customer.create({
      name: 'Demo Seller',
      email: 'seller@iconstore.com',
      contact: 7777777777,
      password: bcrypt.hashSync('seller123', 8),
    });
    console.log('Seeded demo accounts (admin/demo/seller)');
  }
}

const port = process.env.PORT || 5000;
seed().then(() => {
  app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
  });
});
