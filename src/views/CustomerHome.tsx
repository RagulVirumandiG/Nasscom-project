import React from 'react';
import { Product, Category } from '../types';
import { BannerSlider } from '../components/BannerSlider';
import { FlashSale } from '../components/FlashSale';
import { ProductCard } from '../components/ProductCard';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Sparkles, ArrowRight, Flame, Clock, Heart, ShoppingBag } from 'lucide-react';

interface CustomerHomeProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (p: Product) => void;
  onSelectCategory: (catName: string) => void;
  onViewAllProducts: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  products,
  categories,
  onSelectProduct,
  onSelectCategory,
  onViewAllProducts,
}) => {
  const { recentlyViewed } = useCartWishlist();

  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const recommended = products.filter((p) => p.isRecommended);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Promotional Hero Banners */}
      <BannerSlider onShopNow={onSelectCategory} />

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-500">Explore curated collections across top departments</p>
          </div>
          <button
            onClick={onViewAllProducts}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group relative bg-white p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-200 shadow-xs hover:shadow-lg transition cursor-pointer text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center mb-2 overflow-hidden border border-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition line-clamp-1">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner & Deals */}
      <FlashSale products={products} onSelectProduct={onSelectProduct} />

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">New Arrivals</h2>
                <p className="text-xs text-slate-500">Fresh items added to our store this week</p>
              </div>
            </div>
            <button
              onClick={onViewAllProducts}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
            >
              <span>See More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Best Sellers</h2>
                <p className="text-xs text-slate-500">Most popular and highly rated products</p>
              </div>
            </div>
            <button
              onClick={onViewAllProducts}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
            >
              <span>See More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended For You */}
      {recommended.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recommended For You</h2>
              <p className="text-xs text-slate-500">Handpicked selections based on your browsing interest</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommended.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recently Viewed Products</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recentlyViewed.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="bg-white p-2.5 rounded-2xl border border-slate-100 hover:shadow-md cursor-pointer transition text-center"
              >
                <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover rounded-xl mb-2" />
                <h4 className="text-xs font-bold text-slate-800 truncate">{p.name}</h4>
                <p className="text-[11px] text-indigo-600 font-extrabold">${p.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
