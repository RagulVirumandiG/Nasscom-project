import React from 'react';
import { Product, Category, FilterState } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

interface CategoriesViewProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectProduct: (p: Product) => void;
  onOpenFilter: () => void;
  filters: FilterState;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onOpenFilter,
  filters,
}) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Category Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {selectedCategory === 'all' ? 'All Products Catalog' : `${selectedCategory} Department`}
          </h1>
          <p className="text-xs text-slate-500">
            Showing {products.length} available items
          </p>
        </div>

        <button
          onClick={onOpenFilter}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-2xs flex items-center gap-2 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Filter & Sort Products</span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          All Departments
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
              selectedCategory.toLowerCase() === c.name.toLowerCase()
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
          <Search className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No products match your active search or filters</h3>
          <p className="text-xs text-slate-500">Try loosening your price range or switching category filters.</p>
        </div>
      )}

    </div>
  );
};
