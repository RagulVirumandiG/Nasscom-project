import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<User>;
  signup: (data: { name: string; email: string; pass: string; phone?: string; role?: 'customer' | 'admin' }) => Promise<User>;
  logout: () => void;
  switchRoleToggle: () => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ecom_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ecom_token') || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecom_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ecom_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ecom_token', token);
    } else {
      localStorage.removeItem('ecom_token');
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setCurrentUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const signup = async (data: { name: string; email: string; pass: string; phone?: string; role?: 'customer' | 'admin' }) => {
    const res = await api.signup({
      name: data.name,
      email: data.email,
      password: data.pass,
      phone: data.phone,
      role: data.role || 'customer'
    });
    setCurrentUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  // Quick demo toggle: switch between admin and customer by logging in with demo accounts
  const switchRoleToggle = async () => {
    if (!currentUser) return;
    if (currentUser.role === 'admin') {
      try {
        const res = await api.login({ email: 'customer@ecommerce.com', password: 'demo' });
        setCurrentUser(res.user);
        setToken(res.token);
      } catch {
        // If demo login fails, just toggle role locally
        setCurrentUser(prev => prev ? { ...prev, role: 'customer' } : null);
      }
    } else {
      try {
        const res = await api.login({ email: 'admin@ecommerce.com', password: 'demo' });
        setCurrentUser(res.user);
        setToken(res.token);
      } catch {
        setCurrentUser(prev => prev ? { ...prev, role: 'admin' } : null);
      }
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    try {
      const updated = await api.updateUserProfile(currentUser.id, data);
      setCurrentUser(updated);
    } catch {
      // Local fallback if API fails
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const addAddress = async (addrData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...addrData,
      id: `addr-${Date.now()}`
    };
    const addresses = [...(currentUser.addresses || [])];
    if (newAddr.isDefault) {
      addresses.forEach(a => (a.isDefault = false));
    }
    if (addresses.length === 0) newAddr.isDefault = true;
    addresses.push(newAddr);

    try {
      const updated = await api.updateUserAddresses(currentUser.id, addresses);
      setCurrentUser(updated);
    } catch {
      setCurrentUser({ ...currentUser, addresses });
    }
  };

  const updateAddress = async (id: string, patch: Partial<Address>) => {
    if (!currentUser) return;
    const addresses = (currentUser.addresses || []).map(a => {
      if (a.id === id) return { ...a, ...patch };
      if (patch.isDefault) return { ...a, isDefault: false };
      return a;
    });
    try {
      const updated = await api.updateUserAddresses(currentUser.id, addresses);
      setCurrentUser(updated);
    } catch {
      setCurrentUser({ ...currentUser, addresses });
    }
  };

  const deleteAddress = async (id: string) => {
    if (!currentUser) return;
    const addresses = (currentUser.addresses || []).filter(a => a.id !== id);
    try {
      const updated = await api.updateUserAddresses(currentUser.id, addresses);
      setCurrentUser(updated);
    } catch {
      setCurrentUser({ ...currentUser, addresses });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        signup,
        logout,
        switchRoleToggle,
        addAddress,
        updateAddress,
        deleteAddress,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
