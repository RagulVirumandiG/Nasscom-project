import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, Key, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'login', onClose }) => {
  if (!isOpen) return null;

  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot'>(initialMode);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      // Trigger OTP verification step
      const res = await api.sendOtp(email);
      if (res.otpCode) {
        setGeneratedOtp(res.otpCode);
        setMode('otp');
      } else {
        await signup({ name, email, pass: password, phone, role });
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await api.verifyOtp(email, otpCode);
      await signup({ name, email, pass: password, phone, role });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="flex border-b border-slate-100 mb-6 font-bold text-sm">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-center border-b-2 transition ${
                mode === 'login' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-center border-b-2 transition ${
                mode === 'signup' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200 mb-4">
            {errorMsg}
          </p>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="customer@ecommerce.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-indigo-600 hover:underline font-semibold text-[11px]"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {isLoading ? 'Signing In...' : 'Sign In to SuperStore'}
            </button>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('customer@ecommerce.com');
                  setPassword('password123');
                }}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px]"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@ecommerce.com');
                  setPassword('admin123');
                }}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px]"
              >
                Demo Admin
              </button>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Brindha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="brindha@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Role:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-2 rounded-xl border text-center font-bold ${
                    role === 'customer' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Customer Account
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2 rounded-xl border text-center font-bold ${
                    role === 'admin' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Admin Portal
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition mt-2"
            >
              {isLoading ? 'Generating Verification...' : 'Send Verification OTP'}
            </button>
          </form>
        )}

        {/* OTP VERIFICATION */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-600" /> Verification Code Sent!
              </span>
              <p className="text-[11px]">
                We sent a 6-digit code to <strong>{email}</strong>.
              </p>
              {generatedOtp && (
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Demo Copy OTP:</span>
                  <span className="ml-2 font-mono font-extrabold text-indigo-600 text-sm bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {generatedOtp}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-center text-lg tracking-widest font-mono font-bold focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP & Complete Registration'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
            <p className="text-slate-500">Enter your email address to receive password recovery instructions.</p>
            {errorMsg ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold">
                {errorMsg}
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="customer@ecommerce.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(`Password reset link sent to ${email || 'customer@ecommerce.com'}`);
                    setTimeout(() => {
                      setMode('login');
                      setErrorMsg('');
                    }, 2000);
                  }}
                  className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                >
                  Send Reset Link
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className="w-full text-slate-500 hover:underline text-center block pt-1"
            >
              Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
