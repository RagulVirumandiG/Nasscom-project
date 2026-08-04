import React, { useState, useEffect } from 'react';
import { Product, Category, Order, User, AdminStats, OrderStatus } from '../types';
import { api } from '../services/api';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  DollarSign, ShoppingBag, Users, Package, AlertTriangle, Plus, Edit, Trash2, CheckCircle2,
  XCircle, Ban, Database, RefreshCw, ShieldCheck, Search
} from 'lucide-react';

interface AdminDashboardProps {
  onRefreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefreshProducts }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'orders' | 'users'>('analytics');
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dbStatus, setDbStatus] = useState<{ mode: string; mongoConnected: boolean }>({ mode: 'Loading...', mongoConnected: false });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Search in admin tables
  const [productSearch, setProductSearch] = useState('');

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'Electronics',
    price: 99,
    originalPrice: 129,
    discount: 20,
    stock: 20,
    description: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']
  });

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, pData, cData, oData, uData, dbInfo] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getUsers(),
        api.getDbStatus()
      ]);
      setStats(sData);
      setProducts(pData);
      setCategories(cData);
      setOrders(oData);
      setUsers(uData);
      setDbStatus(dbInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Product CRUD Handlers
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) return;

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, prodForm);
      } else {
        await api.createProduct(prodForm);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadData();
      onRefreshProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      loadData();
      onRefreshProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Category CRUD Handlers
  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      await api.createCategory({
        name: catName,
        description: catDesc,
        icon: 'ShoppingBag',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
      });
      setShowCatModal(false);
      setCatName('');
      setCatDesc('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, `Status updated by admin to ${newStatus}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // User Block Handler
  const handleToggleBlockUser = async (userId: string) => {
    try {
      await api.toggleBlockUser(userId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            <span>Store Admin Management Portal</span>
          </h1>
          <p className="text-xs text-slate-500">Live analytics, stock inventory control, order fulfillment, and user access</p>
        </div>

        {/* DB Connection Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-mono flex items-center gap-2 shadow-xs">
            <Database className={`w-3.5 h-3.5 ${dbStatus.mongoConnected ? 'text-emerald-400' : 'text-sky-400'}`} />
            <span>DB Engine: <strong className={dbStatus.mongoConnected ? 'text-emerald-300' : 'text-sky-300'}>{dbStatus.mode}</strong></span>
          </div>

          <button
            onClick={loadData}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none font-bold text-xs">
        {[
          { id: 'analytics', label: 'Analytics Dashboard', icon: DollarSign },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: ShoppingBag },
          { id: 'orders', label: `Orders (${orders.length})`, icon: CheckCircle2 },
          { id: 'users', label: `Customers (${users.length})`, icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl border transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
              <p className="text-xl font-extrabold text-indigo-600">${stats.totalRevenue}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
              <p className="text-xl font-extrabold text-slate-900">{stats.totalOrders}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Orders</span>
              <p className="text-xl font-extrabold text-amber-600">{stats.pendingOrders}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Products</span>
              <p className="text-xl font-extrabold text-slate-900">{stats.totalProducts}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alerts</span>
              <p className="text-xl font-extrabold text-rose-600">{stats.lowStockCount}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Users</span>
              <p className="text-xl font-extrabold text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Monthly Sales Revenue Trend ($)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyRevenue}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#e0e7ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Sales Volume by Category
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categorySales}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search products by title, brand, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProdForm({
                  name: '',
                  brand: '',
                  category: 'Electronics',
                  price: 99,
                  originalPrice: 129,
                  discount: 20,
                  stock: 20,
                  description: '',
                  images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80']
                });
                setShowProductModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-3">Product</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-slate-400">Rating: {p.rating} ★ ({p.numReviews})</p>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{p.brand}</td>
                    <td className="p-3">
                      <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">${p.price}</td>
                    <td className="p-3 font-bold">
                      <span className={p.stock < 10 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProdForm(p);
                          setShowProductModal(true);
                        }}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Store Categories</h3>
            <button
              onClick={() => setShowCatModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              + Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{c.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-slate-900">#{o.id}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-800">{o.customerName}</p>
                    <p className="text-[10px] text-slate-400">{o.customerEmail}</p>
                  </td>
                  <td className="p-3 text-slate-600">{o.items.length} items</td>
                  <td className="p-3 font-extrabold text-slate-900">${o.totalAmount}</td>
                  <td className="p-3">
                    <span className="font-bold text-xs">{o.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="p-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.isBlocked ? (
                      <span className="text-rose-600 font-bold">Blocked</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">Active</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleBlockUser(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        u.isBlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingProduct ? 'Edit Product Details' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  value={prodForm.name}
                  onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={prodForm.brand}
                    onChange={e => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={e => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    {['Electronics', 'Fashion', 'Grocery', 'Beauty', 'Sports', 'Home & Kitchen', 'Books'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Original Price</label>
                  <input
                    type="number"
                    value={prodForm.originalPrice}
                    onChange={e => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={e => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={e => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add New Category</h3>
            <form onSubmit={handleSaveCategorySubmit} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Category Name (e.g. Toys)"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={catDesc}
                onChange={e => setCatDesc(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-3 py-1.5 text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white font-bold rounded-xl">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
