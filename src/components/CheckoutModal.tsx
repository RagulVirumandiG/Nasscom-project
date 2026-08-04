import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useAuth } from '../context/AuthContext';
import { Address, PaymentMethod, Order } from '../types';
import { api } from '../services/api';
import {
  X,
  CheckCircle2,
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Plus,
  Sparkles,
  Package,
  KeyRound,
  Send,
  Phone,
  AlertCircle,
  Download
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  if (!isOpen) return null;

  const { cart, subtotal, discountAmount, taxAmount, appliedCoupon, clearCart } = useCartWishlist();
  const { currentUser, addAddress } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); // 1: Address, 2: Delivery, 3: Payment, 4: Review, 5: Success

  // Selected Address
  const userAddresses = currentUser?.addresses || [];
  const [selectedAddrId, setSelectedAddrId] = useState<string>(
    userAddresses.find(a => a.isDefault)?.id || userAddresses[0]?.id || ''
  );

  // New Address Form State
  const [showAddAddr, setShowAddAddr] = useState(userAddresses.length === 0);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    isDefault: true
  });

  // Selected Delivery Method
  const deliveryOptions = [
    { id: 'standard', title: 'Standard Delivery', price: 0, estimatedDays: '3-5 business days' },
    { id: 'express', title: 'Express Fast Delivery', price: 9.99, estimatedDays: '1-2 business days' },
    { id: 'sameday', title: 'Priority Same-Day Delivery', price: 19.99, estimatedDays: 'Today before 8 PM' }
  ];
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Phone OTP');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Phone OTP Payment State
  const [phoneForOtp, setPhoneForOtp] = useState(currentUser?.phone || '+1 555-321-7890');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const deliveryFee = selectedDelivery.price;
  const grandTotal = Number((subtotal - discountAmount + deliveryFee + taxAmount).toFixed(2));

  const handleSendOtp = () => {
    if (!phoneForOtp || phoneForOtp.trim().length < 8) {
      setOtpError('Please enter a valid mobile phone number.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError(null);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setIsOtpSent(true);
      setIsSendingOtp(false);
    }, 500);
  };

  const handleVerifyOtp = () => {
    if (inputOtp.trim() === generatedOtp) {
      setIsOtpVerified(true);
      setOtpError(null);
    } else {
      setOtpError('Incorrect OTP code. Please enter the exact 6-digit code from the SMS notification.');
    }
  };

  const handleProceedFromPayment = () => {
    // Mandate OTP verification for ALL payment methods
    if (!isOtpVerified) {
      if (!isOtpSent) {
        setOtpError('Please enter your mobile phone number and click "Send OTP" to authorize payment.');
      } else {
        setOtpError('Please enter and verify the 6-digit SMS OTP code sent to your phone before continuing.');
      }
      return;
    }

    if (paymentMethod === 'UPI' && !upiId.trim()) {
      setOtpError('Please enter a valid UPI VPA ID (e.g. username@okaxis).');
      return;
    }

    if ((paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      setOtpError('Please fill in all credit/debit card fields (Card Number, Expiry, CVV).');
      return;
    }

    setOtpError(null);
    setStep(4);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) return;
    addAddress(newAddr);
    setShowAddAddr(false);
  };

  const handlePlaceOrderSubmit = async () => {
    const selectedAddressObj = userAddresses.find(a => a.id === selectedAddrId) || {
      id: 'addr-manual',
      ...newAddr
    };

    setIsProcessing(true);

    try {
      const orderData: Partial<Order> = {
        userId: currentUser?.id || 'guest-user',
        customerName: selectedAddressObj.fullName || currentUser?.name || 'Customer',
        customerEmail: currentUser?.email || 'customer@ecommerce.com',
        customerPhone: paymentMethod === 'Phone OTP' ? phoneForOtp : (selectedAddressObj.phone || currentUser?.phone || '+1 555-000-0000'),
        items: cart,
        shippingAddress: selectedAddressObj as Address,
        deliveryOption: selectedDelivery,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        transactionId: paymentMethod === 'COD' 
          ? undefined 
          : (paymentMethod === 'Phone OTP' ? `TXN-OTP-${Math.floor(100000 + Math.random() * 900000)}` : `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`),
        subtotal,
        discount: discountAmount,
        deliveryFee,
        tax: taxAmount,
        totalAmount: grandTotal,
        couponCode: appliedCoupon?.code
      };

      const order = await api.createOrder(orderData);
      setCreatedOrder(order);
      clearCart();
      setIsProcessing(false);
      setStep(5); // Success step
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {step < 5 ? step : '✓'}
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {step === 1 && 'Select Delivery Address'}
              {step === 2 && 'Choose Shipping Option'}
              {step === 3 && 'Payment Gateway & OTP'}
              {step === 4 && 'Review Order Details'}
              {step === 5 && 'Order Confirmed!'}
            </h2>
          </div>

          {step < 5 && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Address Selection */}
        {step === 1 && (
          <div className="space-y-4">
            {userAddresses.length > 0 && !showAddAddr ? (
              <div className="space-y-3">
                {userAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddrId(addr.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                      selectedAddrId === addr.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedAddrId === addr.id}
                      onChange={() => setSelectedAddrId(addr.id)}
                      className="mt-1 accent-indigo-600"
                    />
                    <div className="flex-1 text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold">{addr.fullName}</strong>
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-slate-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-slate-500">Phone: {addr.phone}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowAddAddr(true)}
                  className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 text-indigo-600 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newAddr.fullName}
                      onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={newAddr.phone}
                      onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Street / House No / Apartment</label>
                  <input
                    type="text"
                    placeholder="e.g. 42 Blossom Way, Apt 3B"
                    value={newAddr.street}
                    onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={newAddr.city}
                      onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={newAddr.state}
                      onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pincode / Zip</label>
                    <input
                      type="text"
                      value={newAddr.pincode}
                      onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Save & Use Address
                  </button>
                  {userAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddAddr(false)}
                      className="text-slate-500 hover:underline text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                disabled={!selectedAddrId && !showAddAddr}
                onClick={() => setStep(2)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Continue to Shipping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Delivery Option */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-3">
              {deliveryOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedDelivery(opt)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    selectedDelivery.id === opt.id
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className={`w-5 h-5 ${selectedDelivery.id === opt.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{opt.title}</h4>
                      <p className="text-[11px] text-slate-500">{opt.estimatedDays}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    {opt.price === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${opt.price}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-slate-600 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Method */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'Phone OTP' as PaymentMethod, label: 'Phone Number & OTP Pay', icon: Smartphone },
                { id: 'UPI' as PaymentMethod, label: 'UPI (GPay / PhonePe)', icon: Smartphone },
                { id: 'Razorpay' as PaymentMethod, label: 'Razorpay Gateway', icon: Sparkles },
                { id: 'Credit Card' as PaymentMethod, label: 'Credit Card', icon: CreditCard },
                { id: 'Debit Card' as PaymentMethod, label: 'Debit Card', icon: CreditCard },
                { id: 'COD' as PaymentMethod, label: 'Cash on Delivery', icon: ShieldCheck }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => {
                      setPaymentMethod(pm.id);
                      setOtpError(null);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition flex flex-col items-start gap-1.5 relative ${
                      isSelected ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-950 shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {pm.id === 'Phone OTP' && (
                      <span className="absolute -top-2 right-2 bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                        Popular
                      </span>
                    )}
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[11px] leading-tight">{pm.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Details Depending on Payment Method */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Enter VPA / UPI ID:</label>
                <input
                  type="text"
                  placeholder="e.g. username@okaxis or 9876543210@ybl"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Card Number:</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8910"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Expiry (MM/YY):</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">CVV Security Code:</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Razorpay' && (
              <div className="p-4 bg-indigo-950 text-white rounded-2xl border border-indigo-800 space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Razorpay Secured Mode
                </span>
                <p className="text-[11px] text-slate-300">
                  Instant processing via Razorpay sandbox payment engine with 256-bit encryption.
                </p>
              </div>
            )}

            {/* Mandatory Phone OTP Interactive Verification Form for ALL Payment Methods */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Smartphone className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Mobile Phone & OTP Verification (Required)</h4>
                  <p className="text-[11px] text-slate-500">Security check required for {paymentMethod} payment</p>
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block text-[11px]">Mobile Phone Number:</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="+1 555-321-7890"
                      value={phoneForOtp}
                      onChange={(e) => {
                        setPhoneForOtp(e.target.value);
                        setIsOtpVerified(false);
                        setIsOtpSent(false);
                        setOtpError(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                  >
                    {isSendingOtp ? (
                      'Sending...'
                    ) : isOtpSent ? (
                      <>
                        <Send className="w-3.5 h-3.5" /> Resend OTP
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Send OTP
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SMS Notification Banner when OTP is sent */}
              {isOtpSent && generatedOtp && (
                <div className="p-3 bg-indigo-900 text-white rounded-xl space-y-2 border border-indigo-700 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between gap-2 border-b border-indigo-800 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] font-bold text-indigo-200">📱 Incoming SMS to {phoneForOtp}:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setInputOtp(generatedOtp);
                        setIsOtpVerified(true);
                        setOtpError(null);
                      }}
                      className="text-[10px] font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 px-2 py-0.5 rounded-md transition shadow-xs"
                    >
                      Click to Auto-fill OTP
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono bg-indigo-950/80 p-2 rounded-lg border border-indigo-800">
                    <span className="text-indigo-200">OTP Security Code:</span>
                    <strong className="text-amber-400 text-sm tracking-widest font-extrabold">{generatedOtp}</strong>
                  </div>
                </div>
              )}

              {/* OTP Code Entry */}
              {isOtpSent && (
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-slate-800 block text-[11px]">Enter 6-Digit Verification OTP Code:</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 482910"
                        value={inputOtp}
                        onChange={(e) => {
                          setInputOtp(e.target.value);
                          setOtpError(null);
                        }}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 text-xs font-mono tracking-widest font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className={`px-5 py-2 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                        isOtpVerified
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isOtpVerified ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {isOtpVerified && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>OTP Verified Successfully! Authorization complete.</span>
                </div>
              )}

              {/* Error Banner */}
              {otpError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-slate-600 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleProceedFromPayment}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <span>Review Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Order */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                <span>Items Ordered ({cart.length})</span>
                <span>Subtotal</span>
              </div>
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-bold text-slate-800">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-0.5">Shipping Method:</span>
                <p className="text-slate-600">{selectedDelivery.title} ({selectedDelivery.estimatedDays})</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-0.5">Payment Method:</span>
                <p className="text-indigo-600 font-bold flex items-center gap-1">
                  {paymentMethod}
                  {paymentMethod === 'Phone OTP' && <span className="text-[10px] text-emerald-600 font-extrabold">(Verified via {phoneForOtp})</span>}
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Shipping Fee:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Tax (8%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-indigo-200 text-sm font-extrabold text-indigo-900">
                <span>Grand Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="text-slate-600 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handlePlaceOrderSubmit}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-8 py-3 rounded-2xl shadow-lg transition flex items-center gap-2"
              >
                {isProcessing ? 'Processing Order...' : `Place Order ($${grandTotal.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success Screen */}
        {step === 5 && createdOrder && (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your order <strong className="text-indigo-600 font-mono">{createdOrder.id}</strong> has been received and confirmed by the seller.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left max-w-sm mx-auto space-y-1">
              <p><strong>Estimated Delivery:</strong> {createdOrder.deliveryOption.estimatedDays}</p>
              <p><strong>Payment Method:</strong> <span className="text-indigo-600 font-bold">{createdOrder.paymentMethod}</span></p>
              <p><strong>Payment Status:</strong> <span className="text-emerald-600 font-bold">{createdOrder.paymentStatus}</span></p>
              {createdOrder.transactionId && <p><strong>Transaction ID:</strong> <span className="font-mono text-slate-700">{createdOrder.transactionId}</span></p>}
              <p><strong>Total Paid:</strong> ${createdOrder.totalAmount}</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <button
                onClick={() => generateInvoicePDF(createdOrder)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF Invoice
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOrderSuccess(createdOrder);
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Package className="w-4 h-4" /> Track Order Status
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
