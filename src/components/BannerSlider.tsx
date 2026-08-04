import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, ArrowRight } from 'lucide-react';

interface BannerSliderProps {
  onShopNow: (category?: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onShopNow }) => {
  const slides = [
    {
      id: 1,
      title: 'Summer Tech & Electronics Expo',
      subtitle: 'Up to 40% off on Premium Wireless Audio & Smartwatches',
      cta: 'Explore Electronics',
      category: 'Electronics',
      bgGradient: 'from-slate-900 via-indigo-950 to-indigo-900',
      badge: 'Limited Time Deal',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'New Season Fashion Collection',
      subtitle: 'Discover trending apparel, vintage outerwear, and designer footwear',
      cta: 'Shop Fashion Deals',
      category: 'Fashion',
      bgGradient: 'from-indigo-900 via-purple-950 to-slate-900',
      badge: 'New Arrivals',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Smart Kitchen & Living Essentials',
      subtitle: 'Transform your home with modern air fryers, ergonomic chairs, & accessories',
      cta: 'Browse Home & Kitchen',
      category: 'Home & Kitchen',
      bgGradient: 'from-slate-950 via-sky-950 to-slate-900',
      badge: 'Best Sellers',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-900 text-white my-6">
      <div className="relative min-h-[300px] sm:min-h-[360px] flex items-center">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 bg-gradient-to-r ${s.bgGradient} ${
              idx === currentSlide ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <div className="max-w-xl space-y-4 z-10 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> {s.badge}
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                {s.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                {s.subtitle}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onShopNow(s.category)}
                  className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2 mx-auto md:mx-0"
                >
                  <span>{s.cta}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            <div className="relative w-48 sm:w-64 md:w-80 aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl hidden md:block">
              <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentSlide ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
