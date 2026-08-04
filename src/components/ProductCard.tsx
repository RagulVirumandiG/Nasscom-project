import React from 'react';
import { Product } from '../types';
import { Star, Heart, ShoppingBag, Eye, Zap } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              {product.discount}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
              <Zap className="w-3 h-3 fill-white" /> FLASH SALE
            </span>
          )}
          {product.isBestSeller && !product.isFlashSale && (
            <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
            inWishlist
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span>{product.brand}</span>
            <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
              {product.category}
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.numReviews})</span>
          </div>
        </div>

        {/* Stock & Price */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            {product.stock < 10 && product.stock > 0 && (
              <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                Only {product.stock} left!
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-xs ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white'
            }`}
            title="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
