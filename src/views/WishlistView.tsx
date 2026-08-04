import React from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { Product } from '../types';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface WishlistViewProps {
  onSelectProduct: (p: Product) => void;
  onExplore: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onSelectProduct, onExplore }) => {
  const { wishlist, toggleWishlist, moveToCart } = useCartWishlist();

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>My Saved Wishlist</span>
          </h1>
          <p className="text-xs text-slate-500">
            {wishlist.length} items saved for later
          </p>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => onSelectProduct(p)}
                  className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 cursor-pointer"
                >
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{p.brand}</span>
                <h3
                  onClick={() => onSelectProduct(p)}
                  className="text-xs font-bold text-slate-800 line-clamp-2 cursor-pointer hover:text-indigo-600 transition"
                >
                  {p.name}
                </h3>
                <p className="text-sm font-extrabold text-slate-900 mt-2">${p.price}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center gap-2">
                <button
                  onClick={() => moveToCart(p)}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(p)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
          <h3 className="text-sm font-bold text-slate-800">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500">Tap the heart icon on any product to save it here.</p>
          <button
            onClick={onExplore}
            className="mt-2 bg-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-full inline-flex items-center gap-1.5"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
