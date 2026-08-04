export type Role = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  addresses?: Address[];
  isBlocked?: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 - 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string; // e.g. Electronics, Fashion, Grocery, Beauty, Sports, Home & Kitchen, Books
  subCategory?: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage e.g. 20
  description: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  rating: number;
  numReviews: number;
  reviews?: Review[];
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isRecommended?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrderValue?: number;
  description: string;
}

export type OrderStatus = 'Pending' | 'Accepted' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export type PaymentMethod = 'COD' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Razorpay' | 'Phone OTP';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  shippingAddress: Address;
  deliveryOption: {
    title: string;
    price: number;
    estimatedDays: string;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  transactionId?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  couponCode?: string;
  trackingHistory: {
    status: OrderStatus;
    timestamp: string;
    location?: string;
    note?: string;
  }[];
  createdAt: string;
  returnReason?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  colors: string[];
  sizes: string[];
  minDiscount: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockCount: number;
  categorySales: { name: string; count: number; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
}
