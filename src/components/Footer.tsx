import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Headphones, RotateCcw, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Guarantee Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Free Express Shipping</h4>
              <p className="text-slate-400">On all orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Secure Encrypted Payments</h4>
              <p className="text-slate-400">COD, UPI, Cards, Razorpay</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">30 Days Easy Return</h4>
              <p className="text-slate-400">Hassle-free refund policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">24/7 Priority Support</h4>
              <p className="text-slate-400">Live chat & dedicated desk</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SuperStore</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premier e-commerce destination featuring authentic top-tier products across Electronics, Fashion, Grocery, Beauty, Sports, Home & Kitchen, and Books.
            </p>
            
            {/* Payment Method Badges */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Supported Payment Gateways</span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-md">Cash on Delivery</span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-md">UPI (GPay / PhonePe)</span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-md">Debit / Credit Card</span>
                <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded-md">Razorpay</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition">Electronics & Gadgets</a></li>
              <li><a href="#" className="hover:text-white transition">Fashion & Apparel</a></li>
              <li><a href="#" className="hover:text-white transition">Fresh Grocery & Staples</a></li>
              <li><a href="#" className="hover:text-white transition">Beauty & Cosmetics</a></li>
              <li><a href="#" className="hover:text-white transition">Sports & Outdoor Fitness</a></li>
              <li><a href="#" className="hover:text-white transition">Home & Kitchen Appliances</a></li>
              <li><a href="#" className="hover:text-white transition">Bestselling Books</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition">Returns & Exchange</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping Info & Rates</a></li>
              <li><a href="#" className="hover:text-white transition">Coupons & Offers</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ & Help Desk</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition">User Profile</a></li>
              <li><a href="#" className="hover:text-white transition">Saved Addresses</a></li>
              <li><a href="#" className="hover:text-white transition">Wishlist</a></li>
              <li><a href="#" className="hover:text-white transition">Admin Portal</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 E-Commerce SuperStore Inc. All rights reserved. Built with Node.js, Express, MongoDB, & React 19.</p>
        </div>

      </div>
    </footer>
  );
};
