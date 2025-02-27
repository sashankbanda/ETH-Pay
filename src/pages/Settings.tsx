import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle, Shield, Bell, User, Key } from 'lucide-react';

const Settings: React.FC = () => {
  const { isConnected, address } = useWallet();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [email, setEmail] = useState(user?.email || '');
  const [notifyOnSend, setNotifyOnSend] = useState(true);
  const [notifyOnReceive, setNotifyOnReceive] = useState(true);
  const [gasPrice, setGasPrice] = useState('medium');
  const [currency, setCurrency] = useState('usd');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Profile settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Notification preferences saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('Transaction preferences saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <CheckCircle size={20} className="mr-2" />
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} className="mr-2" />
            Profile
          </button>
          <button
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} className="mr-2" />
            Notifications
          </button>
          <button
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'preferences' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            <Shield size={18} className="mr-2" />
            Transaction Preferences
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {isConnected && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Connected Wallet
                  </label>
                  <div className="p-2 bg-gray-100 rounded-md text-gray-700 font-mono">
                    {address}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This is your currently connected Ethereum wallet address
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications}>
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifySend"
                    checked={notifyOnSend}
                    onChange={() => setNotifyOnSend(!notifyOnSend)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifySend" className="ml-2 block text-sm text-gray-700">
                    Notify me when I send ETH
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyReceive"
                    checked={notifyOnReceive}
                    onChange={() => setNotifyOnReceive(!notifyOnReceive)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyReceive" className="ml-2 block text-sm text-gray-700">
                    Notify me when I receive ETH
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyConfirm"
                    checked={true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyConfirm" className="ml-2 block text-sm text-gray-700">
                    Notify me when my transactions are confirmed
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Save Notification Settings
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences}>
              <h3 className="text-lg font-semibold mb-4">Transaction Preferences</h3>
              
              <div className="mb-4">
                <label htmlFor="gasPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Gas Price
                </label>
                <select
                  id="gasPrice"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low (Slower, cheaper)</option>
                  <option value="medium">Medium (Recommended)</option>
                  <option value="high">High (Faster, more expensive)</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="gbp">GBP (£)</option>
                  <option value="jpy">JPY (¥)</option>
                </select>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Save Transaction Preferences
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Key size={20} className="mr-2" />
          Security Settings
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-md">
            <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600 mb-3">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
              Enable 2FA
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-md">
            <h4 className="font-medium mb-2">Password</h4>
            <p className="text-sm text-gray-600 mb-3">
              Change your account password. We recommend using a strong, unique password.
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
              Change Password
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-md">
            <h4 className="font-medium mb-2">Session Management</h4>
            <p className="text-sm text-gray-600 mb-3">
              View and manage your active sessions across different devices.
            </p>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
              Manage Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;