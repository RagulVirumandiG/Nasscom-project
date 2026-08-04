import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, Heart, ShoppingBag, Zap, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, color?: string, size?: string) => void;
  onUpdateProduct?: (updated: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
  onUpdateProduct
}) => {
  if (!product) return null;

  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useCartWishlist();
  const { currentUser } = useAuth();

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product?.id]);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNowClick = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    onBuyNow(product, selectedColor, selectedSize);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const updatedProduct = await api.addReview(product.id, {
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'Verified Buyer',
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        verifiedPurchase: true
      });

      if (onUpdateProduct) onUpdateProduct(updatedProduct);
      setShowReviewForm(false);
      setReviewTitle('');
      setReviewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === img ? 'border-indigo-600 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Delivery Perks */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Free delivery on orders over $100</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>30 days effortless returns & exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Authentic product with 1-Year warranty</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
                <span>{product.brand}</span>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.numReviews} ratings)</span>
              </div>

              {/* Price & Stock */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through">${product.originalPrice}</span>
                )}
                <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-700 block mb-2">Select Color:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          selectedColor === c
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-700 block mb-2">Select Size:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold border flex items-center justify-center transition ${
                          selectedSize === s
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700">Quantity:</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNowClick}
                disabled={product.stock === 0}
                className="w-full sm:flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" /> Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-2xl border transition ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* Customer Reviews & Rating Section */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h2>
              <p className="text-xs text-slate-500">Real feedback from verified buyers</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 font-bold text-xs px-4 py-2 rounded-xl transition shadow-2xs"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Write Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800">Share Your Product Experience</h3>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Your Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Review Headline:</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent build quality and fast delivery!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Detailed Comment:</label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you liked or disliked about this item..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-1">{rev.title}</h4>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
