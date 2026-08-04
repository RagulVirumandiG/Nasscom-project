import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  ChevronDown,
  Database,
  SlidersHorizontal,
  LogOut,
  Package,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { api } from '../services/api';
import { Product } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenFilter: () => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenAuth,
  onOpenFilter,
  onSelectProduct,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { currentUser, logout, switchRoleToggle, isAdmin } = useAuth();
  const { cart, wishlist } = useCartWishlist();
  const [dbInfo, setDbInfo] = useState<{ mode: string; mongoConnected: boolean }>({ mode: 'Loading...', mongoConnected: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecom_search_history');
    return saved ? JSON.parse(saved) : ['Noise Canceling', 'OLED Watch', 'Denim Jacket', 'Air Fryer'];
  });

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getDbStatus().then(info => setDbInfo(info));
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      api.getProducts({ searchQuery }).then(res => {
        setSuggestions(res.slice(0, 5));
        setShowSuggestions(true);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (!searchHistory.includes(searchQuery.trim())) {
      const next = [searchQuery.trim(), ...searchHistory].slice(0, 6);
      setSearchHistory(next);
      localStorage.setItem('ecom_search_history', JSON.stringify(next));
    }
    setShowSuggestions(false);
    setActiveTab('products');
  };

  const handleSuggestionClick = (p: Product) => {
    setShowSuggestions(false);
    setSearchQuery('');
    onSelectProduct(p);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Banner Notice & DB Status Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Free Express Shipping on orders over $100 | Use coupon <strong className="text-amber-300 font-mono">WELCOME10</strong></span>
          </div>

          <div className="flex items-center gap-4">
            {/* DB Connection Indicator */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]" title="Database backend status">
              <Database className={`w-3 h-3 ${dbInfo.mongoConnected ? 'text-emerald-400 animate-pulse' : 'text-sky-400'}`} />
              <span>DB: <strong className={dbInfo.mongoConnected ? 'text-emerald-300' : 'text-sky-300'}>{dbInfo.mode}</strong></span>
            </div>

            {/* Portal Switcher (Customer vs Admin) */}
            <button
              onClick={switchRoleToggle}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-2.5 py-0.5 rounded-md transition text-xs shadow-xs"
              title="Click to toggle between Customer and Admin views"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Switch to {isAdmin ? 'Customer View' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                SuperStore
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider font-semibold uppercase -mt-1">
                E-Commerce Hub
              </span>
            </div>
          </div>

          {/* Search Bar with Auto Suggestions */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products, brands, categories (e.g. Headphones, Air Fryer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <button
                type="button"
                onClick={onOpenFilter}
                className="absolute right-2.5 flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full transition shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Filters</span>
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                {suggestions.length > 0 ? (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Product Suggestions
                    </div>
                    {suggestions.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSuggestionClick(p)}
                        className="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded-xl cursor-pointer transition"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">{p.name}</h4>
                          <span className="text-[11px] text-slate-500">{p.brand} · <strong className="text-indigo-600">${p.price}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching products found.
                  </div>
                )}

                {/* History Tags */}
                {searchHistory.length > 0 && (
                  <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recent Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {searchHistory.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setActiveTab('products');
                            setShowSuggestions(false);
                          }}
                          className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 rounded-full transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition"
              title="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-3.5 py-2 rounded-full transition"
              title="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <span className="text-xs hidden sm:inline">Cart</span>
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            </button>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-full border border-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {currentUser.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                      <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('orders');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-slate-400" /> My Orders & Tracking
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 border-t border-slate-100"
                      >
                        <Settings className="w-4 h-4 text-indigo-500" /> Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition shadow-xs"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 md:hidden hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar Navigation */}
        <nav className="mt-3 pt-2 border-t border-slate-100 hidden md:flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-6 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveTab('home');
              }}
              className={`hover:text-indigo-600 transition pb-1 border-b-2 ${
                activeTab === 'home' && selectedCategory === 'all'
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent'
              }`}
            >
              All Categories
            </button>
            {['Electronics', 'Fashion', 'Grocery', 'Beauty', 'Sports', 'Home & Kitchen', 'Books'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveTab('products');
                }}
                className={`hover:text-indigo-600 transition pb-1 border-b-2 ${
                  selectedCategory === cat ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('flash-sale')}
              className="flex items-center gap-1 font-semibold text-amber-600 hover:text-amber-700 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500" /> Flash Sale
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="hover:text-indigo-600 transition"
            >
              Track Orders
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-full text-xs focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="space-y-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('products');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              All Products
            </button>
            <button
              onClick={() => {
                setActiveTab('flash-sale');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-amber-600 font-semibold hover:bg-amber-50 rounded-lg flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-amber-500" /> Flash Sale Deals
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              My Orders & Return
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                Admin Management Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
