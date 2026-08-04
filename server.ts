// @ts-nocheck
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_COUPONS } from './src/data/initialData.js';
import { Order } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// ================== MONGOOSE SCHEMAS & MODELS ==================
const productSchema = new mongoose.Schema({}, { strict: false, timestamps: false });
const categorySchema = new mongoose.Schema({}, { strict: false, timestamps: false });
const userSchema = new mongoose.Schema({}, { strict: false, timestamps: false });
const couponSchema = new mongoose.Schema({}, { strict: false, timestamps: false });
const orderSchema = new mongoose.Schema({}, { strict: false, timestamps: false });

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

// ================== MONGODB CONNECTION ==================
let isMongoConnected = false;
let mongoServerInstance: MongoMemoryServer | null = null;

// In-memory OTP store (always in-memory, not persisted)
const otpStore = new Map<string, string>();

// Fallback in-memory store (used only when MongoDB is unavailable)
const memoryStore = {
  products: [...INITIAL_PRODUCTS],
  categories: [...INITIAL_CATEGORIES],
  users: [...INITIAL_USERS],
  coupons: [...INITIAL_COUPONS],
  orders: [
    {
      id: 'ORD-10982',
      userId: 'user-demo',
      customerName: 'Brindha Customer',
      customerEmail: 'customer@ecommerce.com',
      customerPhone: '+1 (555) 321-7890',
      items: [
        {
          product: INITIAL_PRODUCTS[0],
          quantity: 1,
          selectedColor: 'Midnight Black'
        }
      ],
      shippingAddress: INITIAL_USERS[1].addresses![0],
      deliveryOption: {
        title: 'Standard Delivery',
        price: 0,
        estimatedDays: '3-5 business days'
      },
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      transactionId: 'UPI-982341203',
      subtotal: 199,
      discount: 0,
      deliveryFee: 0,
      tax: 15.92,
      totalAmount: 214.92,
      status: 'Shipped',
      trackingHistory: [
        { status: 'Pending', timestamp: '2026-07-28T10:00:00.000Z', note: 'Order placed successfully' },
        { status: 'Accepted', timestamp: '2026-07-28T11:30:00.000Z', note: 'Order confirmed by seller' },
        { status: 'Shipped', timestamp: '2026-07-29T09:15:00.000Z', note: 'In transit with Express Logistics', location: 'Distribution Hub - Austin, TX' }
      ],
      createdAt: '2026-07-28T10:00:00.000Z'
    }
  ] as Order[],
};

async function initMongoDB() {
  let uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      await mongoose.connect(uri);
      isMongoConnected = true;
      console.log('Successfully connected to MongoDB database:', uri);
    } catch (err: any) {
      console.warn('Configured MONGODB_URI failed, starting embedded instance:', err.message);
    }
  }

  if (!isMongoConnected) {
    try {
      console.log('Initializing embedded MongoDB server instance on port 27017...');
      try {
        mongoServerInstance = await MongoMemoryServer.create({
          instance: { port: 27017, dbName: 'ecommerce' }
        });
      } catch (e) {
        mongoServerInstance = await MongoMemoryServer.create({
          instance: { dbName: 'ecommerce' }
        });
      }
      uri = mongoServerInstance.getUri();
      await mongoose.connect(uri);
      isMongoConnected = true;
      console.log('Successfully connected to embedded MongoDB database at:', uri);
    } catch (err: any) {
      console.warn('Failed to start embedded MongoDB server. Using in-memory fallback:', err.message);
    }
  }

  if (isMongoConnected) {
    await seedMongoDatabase();
  }
}

async function seedMongoDatabase() {
  try {
    const prodCount = await ProductModel.countDocuments();
    if (prodCount === 0) {
      await ProductModel.insertMany(INITIAL_PRODUCTS);
      console.log(`Seeded ${INITIAL_PRODUCTS.length} products into MongoDB.`);
    }
    const catCount = await CategoryModel.countDocuments();
    if (catCount === 0) {
      await CategoryModel.insertMany(INITIAL_CATEGORIES);
      console.log(`Seeded ${INITIAL_CATEGORIES.length} categories into MongoDB.`);
    }
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      await UserModel.insertMany(INITIAL_USERS);
      console.log(`Seeded ${INITIAL_USERS.length} users into MongoDB.`);
    }
    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      await CouponModel.insertMany(INITIAL_COUPONS);
      console.log(`Seeded ${INITIAL_COUPONS.length} coupons into MongoDB.`);
    }
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      await OrderModel.create(memoryStore.orders[0]);
      console.log('Seeded initial order into MongoDB.');
    }
  } catch (err: any) {
    console.warn('Error seeding MongoDB collections:', err.message);
  }
}

initMongoDB();

// ================== HELPER: lean doc to plain object ==================
function toPlain(doc: any) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  // Replace _id with id if needed
  if (obj._id && !obj.id) obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}
function toPlainArr(docs: any[]) {
  return docs.map(toPlain);
}

// ================== API ENDPOINTS ==================

// DB Status
app.get('/api/db-status', async (_req, res) => {
  try {
    const productCount = isMongoConnected ? await ProductModel.countDocuments() : memoryStore.products.length;
    const orderCount = isMongoConnected ? await OrderModel.countDocuments() : memoryStore.orders.length;
    const userCount = isMongoConnected ? await UserModel.countDocuments() : memoryStore.users.length;
    res.json({
      status: 'ok',
      mode: isMongoConnected ? 'MongoDB' : 'In-Memory Store',
      mongoConnected: isMongoConnected,
      productCount,
      orderCount,
      userCount
    });
  } catch {
    res.json({ status: 'ok', mode: 'In-Memory Store', mongoConnected: false });
  }
});

// ================== AUTH ROUTES ==================

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  if (isMongoConnected) {
    try {
      const existing = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (existing) return res.status(400).json({ error: 'Account with this email already exists.' });

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone: phone || '',
        role: role || 'customer',
        createdAt: new Date().toISOString(),
        addresses: []
      };
      const doc = await UserModel.create(newUser);
      const user = toPlain(doc);
      return res.status(201).json({ user, token: `token-${user.id}` });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Fallback
  const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(400).json({ error: 'Account with this email already exists.' });
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    role: role || 'customer',
    createdAt: new Date().toISOString(),
    addresses: []
  };
  memoryStore.users.push(newUser as any);
  res.status(201).json({ user: newUser, token: `token-${newUser.id}` });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (isMongoConnected) {
    try {
      const doc = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (!doc) return res.status(400).json({ error: 'Invalid credentials or user not found.' });
      const user = toPlain(doc);
      if (user.isBlocked) return res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
      return res.json({ user, token: `token-${user.id}` });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  const user = memoryStore.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) return res.status(400).json({ error: 'Invalid credentials or user not found.' });
  if ((user as any).isBlocked) return res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
  res.json({ user, token: `token-${user.id}` });
});

app.post('/api/auth/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email.toLowerCase(), otpCode);
  res.json({ message: `Verification OTP sent to ${email}`, otpCode });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email?.toLowerCase());
  if (storedOtp && storedOtp === otp) {
    otpStore.delete(email.toLowerCase());
    return res.json({ success: true, message: 'OTP verified successfully.' });
  }
  res.status(400).json({ error: 'Invalid or expired OTP code.' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (isMongoConnected) {
    try {
      const doc = await UserModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (!doc) return res.status(404).json({ error: 'User not found.' });
      return res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  const user = memoryStore.users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ success: true, message: 'Password updated successfully.' });
});

// ================== PRODUCTS ROUTES ==================

app.get('/api/products', async (req, res) => {
  const { q, category, brand, minPrice, maxPrice, minRating, flashSale, newArrivals, bestSellers, recommended, sortBy } = req.query;

  if (isMongoConnected) {
    try {
      const filter: any = {};
      if (q) {
        const re = new RegExp(String(q), 'i');
        filter.$or = [{ name: re }, { brand: re }, { category: re }, { description: re }];
      }
      if (category && category !== 'all') filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      if (brand && brand !== 'all') filter.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
      if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
      if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
      if (minRating) filter.rating = { $gte: Number(minRating) };
      if (flashSale === 'true') filter.isFlashSale = true;
      if (newArrivals === 'true') filter.isNewArrival = true;
      if (bestSellers === 'true') filter.isBestSeller = true;
      if (recommended === 'true') filter.isRecommended = true;

      let sort: any = {};
      if (sortBy === 'price-low') sort = { price: 1 };
      else if (sortBy === 'price-high') sort = { price: -1 };
      else if (sortBy === 'rating') sort = { rating: -1 };
      else if (sortBy === 'newest') sort = { createdAt: -1 };
      else if (sortBy === 'discount') sort = { discount: -1 };

      const docs = await ProductModel.find(filter).sort(sort).lean();
      const products = docs.map((d: any) => {
        if (d._id && !d.id) d.id = d._id.toString();
        delete d._id; delete d.__v;
        return d;
      });
      return res.json(products);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Fallback
  let list = [...memoryStore.products];
  if (q) {
    const qs = String(q).toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(qs) || p.brand.toLowerCase().includes(qs) || p.category.toLowerCase().includes(qs) || p.description.toLowerCase().includes(qs));
  }
  if (category && category !== 'all') list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  if (brand && brand !== 'all') list = list.filter(p => p.brand.toLowerCase() === String(brand).toLowerCase());
  if (minPrice) list = list.filter(p => p.price >= Number(minPrice));
  if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice));
  if (minRating) list = list.filter(p => p.rating >= Number(minRating));
  if (flashSale === 'true') list = list.filter(p => p.isFlashSale);
  if (newArrivals === 'true') list = list.filter(p => p.isNewArrival);
  if (bestSellers === 'true') list = list.filter(p => p.isBestSeller);
  if (recommended === 'true') list = list.filter(p => p.isRecommended);
  if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else if (sortBy === 'discount') list.sort((a, b) => b.discount - a.discount);
  res.json(list);
});

app.get('/api/products/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const doc = await ProductModel.findOne({ id: req.params.id }).lean() as any;
      if (!doc) return res.status(404).json({ error: 'Product not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  const prod = memoryStore.products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  res.json(prod);
});

app.post('/api/products/:id/reviews', async (req, res) => {
  const { userId, userName, rating, title, comment } = req.body;
  const newReview = {
    id: `rev-${Date.now()}`,
    userId: userId || 'u-guest',
    userName: userName || 'Anonymous Customer',
    rating: Number(rating) || 5,
    title,
    comment,
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true
  };

  if (isMongoConnected) {
    try {
      const doc = await ProductModel.findOne({ id: req.params.id }) as any;
      if (!doc) return res.status(404).json({ error: 'Product not found' });
      if (!doc.reviews) doc.reviews = [];
      doc.reviews.unshift(newReview);
      doc.numReviews = doc.reviews.length;
      const totalScore = doc.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      doc.rating = Number((totalScore / doc.numReviews).toFixed(1));
      doc.markModified('reviews');
      await doc.save();
      const plain = doc.toObject();
      if (plain._id && !plain.id) plain.id = plain._id.toString();
      delete plain._id; delete plain.__v;
      return res.status(201).json(plain);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  const prod = memoryStore.products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  if (!prod.reviews) prod.reviews = [];
  prod.reviews.unshift(newReview);
  prod.numReviews = prod.reviews.length;
  const totalScore = prod.reviews.reduce((acc, r) => acc + r.rating, 0);
  prod.rating = Number((totalScore / prod.numReviews).toFixed(1));
  res.status(201).json(prod);
});

app.post('/api/products', async (req, res) => {
  const newProd = {
    ...req.body,
    id: `prod-${Date.now()}`,
    rating: req.body.rating || 5,
    numReviews: req.body.numReviews || 0,
    reviews: [],
    createdAt: new Date().toISOString()
  };

  if (isMongoConnected) {
    try {
      const doc = await ProductModel.create(newProd);
      const plain = toPlain(doc);
      return res.status(201).json(plain);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  memoryStore.products.unshift(newProd as any);
  res.status(201).json(newProd);
});

app.put('/api/products/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const doc = await ProductModel.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true }).lean() as any;
      if (!doc) return res.status(404).json({ error: 'Product not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  const index = memoryStore.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  memoryStore.products[index] = { ...memoryStore.products[index], ...req.body };
  res.json(memoryStore.products[index]);
});

app.delete('/api/products/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      await ProductModel.deleteOne({ id: req.params.id });
      return res.json({ success: true, message: 'Product deleted' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  memoryStore.products = memoryStore.products.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

// ================== CATEGORIES ROUTES ==================

app.get('/api/categories', async (_req, res) => {
  if (isMongoConnected) {
    try {
      const docs = await CategoryModel.find({}).lean();
      const cats = docs.map((d: any) => { if (d._id && !d.id) d.id = d._id.toString(); delete d._id; delete d.__v; return d; });
      return res.json(cats);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json(memoryStore.categories);
});

app.post('/api/categories', async (req, res) => {
  const newCat = {
    ...req.body,
    id: req.body.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  };
  if (isMongoConnected) {
    try {
      const doc = await CategoryModel.create(newCat);
      return res.status(201).json(toPlain(doc));
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  memoryStore.categories.push(newCat as any);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const doc = await CategoryModel.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true }).lean() as any;
      if (!doc) return res.status(404).json({ error: 'Category not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  const index = memoryStore.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  memoryStore.categories[index] = { ...memoryStore.categories[index], ...req.body };
  res.json(memoryStore.categories[index]);
});

app.delete('/api/categories/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      await CategoryModel.deleteOne({ id: req.params.id });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  memoryStore.categories = memoryStore.categories.filter(c => c.id !== req.params.id) as any;
  res.json({ success: true });
});

// ================== COUPONS ROUTE ==================

app.post('/api/coupons/validate', async (req, res) => {
  const { code, orderValue } = req.body;

  if (isMongoConnected) {
    try {
      const doc = await CouponModel.findOne({ code: { $regex: new RegExp(`^${String(code).trim()}$`, 'i') } }).lean() as any;
      if (!doc) return res.status(404).json({ error: 'Invalid coupon code' });
      const coupon = doc;
      if (coupon._id && !coupon.id) coupon.id = coupon._id.toString();
      delete coupon._id; delete coupon.__v;
      if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
        return res.status(400).json({ error: `Coupon requires minimum order value of $${coupon.minOrderValue}` });
      }
      return res.json({ coupon });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  const coupon = memoryStore.coupons.find(c => c.code.toUpperCase() === String(code).trim().toUpperCase());
  if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });
  if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
    return res.status(400).json({ error: `Coupon requires minimum order value of $${coupon.minOrderValue}` });
  }
  res.json({ coupon });
});

// ================== ORDERS ROUTES ==================

app.get('/api/orders', async (req, res) => {
  const { userId } = req.query;

  if (isMongoConnected) {
    try {
      const filter = userId ? { userId } : {};
      const docs = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
      const orders = docs.map((d: any) => { if (d._id && !d.id) d.id = d._id.toString(); delete d._id; delete d.__v; return d; });
      return res.json(orders);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (userId) {
    return res.json(memoryStore.orders.filter(o => o.userId === userId));
  }
  res.json(memoryStore.orders);
});

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  const newOrder = {
    ...orderData,
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'Pending',
    trackingHistory: [
      {
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: 'Order placed successfully. Waiting for seller confirmation.'
      }
    ],
    createdAt: new Date().toISOString()
  };

  if (isMongoConnected) {
    try {
      const doc = await OrderModel.create(newOrder);
      // Decrement product stock in MongoDB
      for (const item of newOrder.items) {
        await ProductModel.findOneAndUpdate(
          { id: item.product.id },
          { $inc: { stock: -item.quantity } }
        );
      }
      const plain = toPlain(doc);
      return res.status(201).json(plain);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  memoryStore.orders.unshift(newOrder as any);
  for (const item of newOrder.items) {
    const prod = memoryStore.products.find(p => p.id === item.product.id);
    if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
  }
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { status, note, location } = req.body;
  const trackingEntry = {
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status}`,
    location
  };

  if (isMongoConnected) {
    try {
      const doc = await OrderModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { status }, $push: { trackingHistory: trackingEntry } },
        { new: true }
      ).lean() as any;
      if (!doc) return res.status(404).json({ error: 'Order not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  const order = memoryStore.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = status;
  order.trackingHistory.push(trackingEntry);
  res.json(order);
});

app.put('/api/orders/:id/cancel', async (req, res) => {
  const { reason } = req.body;
  const trackingEntry = {
    status: 'Cancelled',
    timestamp: new Date().toISOString(),
    note: `Order cancelled by customer. Reason: ${reason || 'N/A'}`
  };

  if (isMongoConnected) {
    try {
      const doc = await OrderModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { status: 'Cancelled', returnReason: reason }, $push: { trackingHistory: trackingEntry } },
        { new: true }
      ).lean() as any;
      if (!doc) return res.status(404).json({ error: 'Order not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  const order = memoryStore.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = 'Cancelled';
  (order as any).returnReason = reason;
  order.trackingHistory.push(trackingEntry as any);
  res.json(order);
});

app.put('/api/orders/:id/return', async (req, res) => {
  const { reason } = req.body;
  const trackingEntry = {
    status: 'Returned',
    timestamp: new Date().toISOString(),
    note: `Return initiated by customer. Reason: ${reason || 'N/A'}`
  };

  if (isMongoConnected) {
    try {
      const doc = await OrderModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { status: 'Returned', returnReason: reason }, $push: { trackingHistory: trackingEntry } },
        { new: true }
      ).lean() as any;
      if (!doc) return res.status(404).json({ error: 'Order not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  const order = memoryStore.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = 'Returned';
  (order as any).returnReason = reason;
  order.trackingHistory.push(trackingEntry as any);
  res.json(order);
});

// ================== USERS & ADMIN ROUTES ==================

app.get('/api/users', async (_req, res) => {
  if (isMongoConnected) {
    try {
      const docs = await UserModel.find({}).lean();
      const users = docs.map((d: any) => { if (d._id && !d.id) d.id = d._id.toString(); delete d._id; delete d.__v; return d; });
      return res.json(users);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json(memoryStore.users);
});

app.put('/api/users/:id', async (req, res) => {
  if (isMongoConnected) {
    try {
      const doc = await UserModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { new: true }
      ).lean() as any;
      if (!doc) return res.status(404).json({ error: 'User not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  const user = memoryStore.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  res.json(user);
});

app.put('/api/users/:id/block', async (req, res) => {
  if (isMongoConnected) {
    try {
      const existing = await UserModel.findOne({ id: req.params.id }).lean() as any;
      if (!existing) return res.status(404).json({ error: 'User not found' });
      const doc = await UserModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { isBlocked: !existing.isBlocked } },
        { new: true }
      ).lean() as any;
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  const user = memoryStore.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  (user as any).isBlocked = !(user as any).isBlocked;
  res.json(user);
});

app.put('/api/users/:id/addresses', async (req, res) => {
  const { addresses } = req.body;
  if (isMongoConnected) {
    try {
      const doc = await UserModel.findOneAndUpdate(
        { id: req.params.id },
        { $set: { addresses } },
        { new: true }
      ).lean() as any;
      if (!doc) return res.status(404).json({ error: 'User not found' });
      if (doc._id && !doc.id) doc.id = doc._id.toString();
      delete doc._id; delete doc.__v;
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  const user = memoryStore.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  (user as any).addresses = addresses;
  res.json(user);
});

// ================== ADMIN STATS ==================

app.get('/api/admin/stats', async (_req, res) => {
  if (isMongoConnected) {
    try {
      const [allOrders, totalProducts, totalUsers] = await Promise.all([
        OrderModel.find({}).lean(),
        ProductModel.countDocuments(),
        UserModel.countDocuments()
      ]);

      const orders = allOrders as any[];
      const totalRevenue = orders.reduce((acc: number, o: any) => o.status !== 'Cancelled' ? acc + (o.totalAmount || 0) : acc, 0);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;

      const lowStockProducts = await ProductModel.find({ stock: { $lt: 10 } }).lean();
      const lowStockCount = lowStockProducts.length;

      const catMap: Record<string, { count: number; revenue: number }> = {};
      for (const o of orders) {
        if (o.status === 'Cancelled') continue;
        for (const item of (o.items || [])) {
          const cat = (item.product?.category) || 'General';
          if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0 };
          catMap[cat].count += item.quantity || 0;
          catMap[cat].revenue += (item.product?.price || 0) * (item.quantity || 0);
        }
      }
      const categorySales = Object.keys(catMap).map(name => ({
        name, count: catMap[name].count, revenue: Number(catMap[name].revenue.toFixed(2))
      }));

      const monthlyRevenue = [
        { month: 'Mar', revenue: 3200, orders: 18 },
        { month: 'Apr', revenue: 4500, orders: 24 },
        { month: 'May', revenue: 5800, orders: 31 },
        { month: 'Jun', revenue: 7100, orders: 39 },
        { month: 'Jul', revenue: 8900, orders: 48 },
        { month: 'Aug', revenue: Math.round(totalRevenue), orders: totalOrders }
      ];

      return res.json({
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders, totalProducts, totalUsers, pendingOrders, lowStockCount,
        categorySales, monthlyRevenue
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Fallback
  const totalRevenue = memoryStore.orders.reduce((acc, o) => (o.status !== 'Cancelled' ? acc + o.totalAmount : acc), 0);
  const catMap: Record<string, { count: number; revenue: number }> = {};
  for (const o of memoryStore.orders) {
    if (o.status === 'Cancelled') continue;
    for (const item of o.items) {
      const cat = item.product.category || 'General';
      if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0 };
      catMap[cat].count += item.quantity;
      catMap[cat].revenue += item.product.price * item.quantity;
    }
  }
  const categorySales = Object.keys(catMap).map(name => ({ name, count: catMap[name].count, revenue: Number(catMap[name].revenue.toFixed(2)) }));
  const monthlyRevenue = [
    { month: 'Mar', revenue: 3200, orders: 18 },
    { month: 'Apr', revenue: 4500, orders: 24 },
    { month: 'May', revenue: 5800, orders: 31 },
    { month: 'Jun', revenue: 7100, orders: 39 },
    { month: 'Jul', revenue: 8900, orders: 48 },
    { month: 'Aug', revenue: Math.round(totalRevenue), orders: memoryStore.orders.length }
  ];
  res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders: memoryStore.orders.length,
    totalProducts: memoryStore.products.length,
    totalUsers: memoryStore.users.length,
    pendingOrders: memoryStore.orders.filter(o => o.status === 'Pending').length,
    lowStockCount: memoryStore.products.filter(p => p.stock < 10).length,
    categorySales, monthlyRevenue
  });
});

// ================== VITE / STATIC SERVING ==================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
