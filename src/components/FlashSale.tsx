import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Zap, Clock } from 'lucide-react';

interface FlashSaleProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ products, onSelectProduct }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = products.filter(p => p.isFlashSale);

  if (flashSaleItems.length === 0) return null;

  return (
    <section className="my-10 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white text-amber-600 flex items-center justify-center font-bold shadow-md">
            <Zap className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Flash Sale Live</h2>
            <p className="text-xs text-amber-100 font-medium">Extra discounts available for a limited duration</p>
          </div>
        </div>

        {/* Timer Widget */}
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
          <Clock className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">Ends in:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm">
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md">{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span>:</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md">{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span>:</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md">{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashSaleItems.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
        ))}
      </div>
    </section>
  );
};
