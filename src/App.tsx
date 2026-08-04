import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CustomerHome } from './views/CustomerHome';
import { CategoriesView } from './views/CategoriesView';
import { WishlistView } from './views/WishlistView';
import { OrdersView } from './views/OrdersView';
import { ProfileView } from './views/ProfileView';
import { AdminDashboard } from './views/AdminDashboard';
import { AuthModal } from './views/AuthModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchAndFilter } from './components/SearchAndFilter';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { api } from './services/api';
import { Product, Category, FilterState, Order } from './types';

function MainApp() {
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    brand: 'all',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    colors: [],
    sizes: [],
    minDiscount: 0,
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Load Products & Categories
  const fetchProductsData = async () => {
    setLoadingProducts(true);
    try {
      const activeFilters: any = {
        ...filters,
        searchQuery,
        category: selectedCategory !== 'all' ? selectedCategory : filters.category,
      };
      if (activeTab === 'flash-sale') activeFilters.flashSale = true;

      const [pData, cData] = await Promise.all([
        api.getProducts(activeFilters),
        api.getCategories(),
      ]);
      setProducts(pData);
      setCategories(cData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [searchQuery, selectedCategory, filters, activeTab]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setFilters({
      searchQuery: '',
      category: 'all',
      brand: 'all',
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      colors: [],
      sizes: [],
      minDiscount: 0,
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  const handleBuyNowFromModal = (product: Product) => {
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (_order: Order) => {
    setIsCheckoutOpen(false);
    setActiveTab('orders');
  };

  // Brands list for filter drawer
  const brandsList = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onOpenFilter={() => setIsFilterOpen(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <CustomerHome
            products={products}
            categories={categories}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('products');
            }}
            onViewAllProducts={() => setActiveTab('products')}
          />
        )}

        {(activeTab === 'products' || activeTab === 'flash-sale') && (
          <CategoriesView
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenFilter={() => setIsFilterOpen(true)}
            filters={filters}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onExplore={() => setActiveTab('products')}
          />
        )}

        {activeTab === 'orders' && <OrdersView />}

        {activeTab === 'profile' && <ProfileView />}

        {activeTab === 'admin' && (
          <AdminDashboard onRefreshProducts={fetchProductsData} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNowFromModal}
        onUpdateProduct={(updated) => {
          setSelectedProduct(updated);
          fetchProductsData();
        }}
      />

      {/* Search & Filter Drawer */}
      <SearchAndFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories.map((c) => c.name)}
        brands={brandsList}
        onReset={handleResetFilters}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Auth Modal (Sign Up, Login, OTP) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartWishlistProvider>
        <MainApp />
      </CartWishlistProvider>
    </AuthProvider>
  );
}
