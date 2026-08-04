import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Key, CreditCard, ShieldCheck, Plus, Trash2, Edit } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, addAddress, deleteAddress, logout } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // New Address modal state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: nameInput, phone: phoneInput });
    setIsEditingProfile(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      fullName: currentUser?.name || 'Customer',
      phone: currentUser?.phone || '+1 555-000-0000',
      street: newStreet,
      city: newCity,
      state: newState,
      pincode: newPincode,
      type: 'home'
    });
    setShowAddAddressModal(false);
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Account & Settings</h1>
          <p className="text-xs text-slate-500">Manage personal details, delivery addresses, and security settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Personal Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" /> {isEditingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!isEditingProfile ? (
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <p className="text-slate-700">{currentUser.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <p className="text-slate-700">{currentUser.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Role</span>
                <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {currentUser.role}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl"
              >
                Save Profile Changes
              </button>
            </form>
          )}
        </div>

        {/* Saved Addresses Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" /> Saved Delivery Addresses
            </h3>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Address
            </button>
          </div>

          <div className="space-y-3">
            {currentUser.addresses && currentUser.addresses.length > 0 ? (
              currentUser.addresses.map((addr) => (
                <div key={addr.id} className="p-3.5 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-slate-900 font-bold">{addr.fullName}</strong>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-slate-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-slate-400 mt-0.5">Phone: {addr.phone}</p>
                  </div>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4">No saved addresses yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* Security & Password Change */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs max-w-md">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-indigo-600" /> Change Security Password
        </h3>

        {passwordMsg && <p className="text-xs text-emerald-600 font-bold mb-3">{passwordMsg}</p>}

        <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add New Shipping Address</h3>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 750 Commerce Blvd, Apt 400"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
