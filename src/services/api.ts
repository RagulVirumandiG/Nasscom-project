import { Product, Category, User, Order, Coupon, FilterState, AdminStats, Review, OrderStatus } from '../types';

const API_BASE = '/api';

export const api = {
  // DB Status
  async getDbStatus() {
    try {
      const res = await fetch(`${API_BASE}/db-status`);
      return await res.json();
    } catch (e) {
      return { mode: 'In-Memory Store', mongoConnected: false };
    }
  },

  // Auth
  async signup(data: any) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Signup failed');
    return result;
  },

  async login(data: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    return result;
  },

  async sendOtp(email: string) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  },

  async verifyOtp(email: string, otp: string) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'OTP verification failed');
    return result;
  },

  async resetPassword(email: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reset password');
    return result;
  },

  // Products
  async getProducts(filters?: Partial<FilterState> & { flashSale?: boolean; newArrivals?: boolean; bestSellers?: boolean; recommended?: boolean }) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.searchQuery) params.set('q', filters.searchQuery);
      if (filters.category) params.set('category', filters.category);
      if (filters.brand) params.set('brand', filters.brand);
      if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
      if (filters.minRating) params.set('minRating', String(filters.minRating));
      if (filters.flashSale) params.set('flashSale', 'true');
      if (filters.newArrivals) params.set('newArrivals', 'true');
      if (filters.bestSellers) params.set('bestSellers', 'true');
      if (filters.recommended) params.set('recommended', 'true');
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
    }
    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return (await res.json()) as Product[];
  },

  async getProductById(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return (await res.json()) as Product;
  },

  async addReview(productId: string, review: Omit<Review, 'id' | 'date'>) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!res.ok) throw new Error('Failed to post review');
    return (await res.json()) as Product;
  },

  async createProduct(product: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return (await res.json()) as Product;
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return (await res.json()) as Product;
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return await res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return (await res.json()) as Category[];
  },

  async createCategory(category: Partial<Category>) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return (await res.json()) as Category;
  },

  async updateCategory(id: string, category: Partial<Category>) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    return (await res.json()) as Category;
  },

  async deleteCategory(id: string) {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Coupons
  async validateCoupon(code: string, orderValue: number) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderValue })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid coupon');
    return data.coupon as Coupon;
  },

  // Orders
  async getOrders(userId?: string) {
    const url = userId ? `${API_BASE}/orders?userId=${userId}` : `${API_BASE}/orders`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return (await res.json()) as Order[];
  },

  async createOrder(orderData: Partial<Order>) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Failed to place order');
    return (await res.json()) as Order;
  },

  async updateOrderStatus(id: string, status: OrderStatus, note?: string, location?: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, location })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return (await res.json()) as Order;
  },

  async cancelOrder(id: string, reason: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to cancel order');
    return (await res.json()) as Order;
  },

  async returnOrder(id: string, reason: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/return`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to submit return request');
    return (await res.json()) as Order;
  },

  // Users & Admin
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return (await res.json()) as User[];
  },

  async toggleBlockUser(id: string) {
    const res = await fetch(`${API_BASE}/users/${id}/block`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to update user block status');
    return (await res.json()) as User;
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin statistics');
    return (await res.json()) as AdminStats;
  },

  async updateUserProfile(id: string, data: Partial<User>) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return (await res.json()) as User;
  },

  async updateUserAddresses(id: string, addresses: User['addresses']) {
    const res = await fetch(`${API_BASE}/users/${id}/addresses`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses })
    });
    if (!res.ok) throw new Error('Failed to update addresses');
    return (await res.json()) as User;
  }
};

