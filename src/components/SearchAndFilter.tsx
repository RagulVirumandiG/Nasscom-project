import React from 'react';
import { FilterState } from '../types';
import { X, SlidersHorizontal, RotateCcw, Star, Check } from 'lucide-react';

interface SearchAndFilterProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
  brands: string[];
  onReset: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  categories,
  brands,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
              <span>Filter Products</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 pt-6">
            
            {/* Sort By */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="featured">Featured / Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
                <option value="discount">Highest Discount %</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    filters.category === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      filters.category.toLowerCase() === cat.toLowerCase()
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span className="uppercase tracking-wider">Price Range</span>
                <span className="text-indigo-600">${filters.minPrice} - ${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setFilters(prev => ({ ...prev, minRating: stars }))}
                    className={`flex-1 py-1.5 border rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      filters.minRating === stars
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{stars === 0 ? 'Any' : `${stars}+`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Brand
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {brands.map((brand) => {
                  const isSelected = filters.brand.toLowerCase() === brand.toLowerCase();
                  return (
                    <button
                      key={brand}
                      onClick={() => setFilters(prev => ({ ...prev, brand: isSelected ? 'all' : brand }))}
                      className={`p-2 rounded-xl text-xs text-left border flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <span className="truncate">{brand}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">In Stock Only</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                  filters.inStockOnly ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    filters.inStockOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};
