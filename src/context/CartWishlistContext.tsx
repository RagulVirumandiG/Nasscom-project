import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { api } from '../services/api';

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
  appliedCoupon: Coupon | null;
  couponError: string | null;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, delta: number, color?: string, size?: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: Product) => void;
  addRecentlyViewed: (product: Product) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ecom_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ecom_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ecom_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('ecom_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ecom_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ecom_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ecom_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('ecom_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('ecom_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart(prev => {
      const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
      const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart(prev =>
      prev.filter(item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size))
    );
  };

  const updateQuantity = (productId: string, delta: number, color?: string, size?: string) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  const moveToCart = (product: Product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent === 100) {
      discountAmount = 0; // Handled in shipping or total
    } else {
      let rawDiscount = (subtotal * appliedCoupon.discountPercent) / 100;
      if (appliedCoupon.maxDiscount && rawDiscount > appliedCoupon.maxDiscount) {
        rawDiscount = appliedCoupon.maxDiscount;
      }
      discountAmount = rawDiscount;
    }
  }

  const deliveryFee = subtotal > 100 || (appliedCoupon && appliedCoupon.code === 'FREESHIP') ? 0 : 10;
  const taxAmount = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
  const totalAmount = Math.max(0, Number((subtotal - discountAmount + deliveryFee + taxAmount).toFixed(2)));

  const applyCoupon = async (code: string) => {
    setCouponError(null);
    try {
      const coupon = await api.validateCoupon(code, subtotal);
      setAppliedCoupon(coupon);
      return true;
    } catch (err: any) {
      setCouponError(err.message || 'Failed to apply coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        recentlyViewed,
        appliedCoupon,
        couponError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        addRecentlyViewed,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        taxAmount,
        deliveryFee,
        totalAmount
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  return context;
};
