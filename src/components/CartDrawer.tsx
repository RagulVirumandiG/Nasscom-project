import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  if (!isOpen) return null;

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    totalAmount
  } = useCartWishlist();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim());
    setIsApplyingCoupon(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <span>Your Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          {cart.length > 0 ? (
            <div className="divide-y divide-slate-100 my-4 max-h-[45vh] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5 space-x-2">
                      {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                      {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-extrabold text-slate-900">${item.product.price}</span>
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1, item.selectedColor, item.selectedSize)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1, item.selectedColor, item.selectedSize)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="text-xs font-medium">Your cart is currently empty.</p>
            </div>
          )}
        </div>

        {/* Coupon & Summary Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-4">
            
            {/* Coupon Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.discountPercent}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME10, SUPER20)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-bold text-slate-800">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-indigo-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="py-3 px-3 border border-slate-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-2xl transition"
                title="Clear Cart"
              >
                Clear
              </button>
              <button
                onClick={onCheckout}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
