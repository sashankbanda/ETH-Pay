import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Send, List, Settings, Home, LogOut } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <Wallet className="mr-2" size={24} />
            ETH Pay
          </h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === '/' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="mr-2" size={18} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/send"
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === '/send' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Send className="mr-2" size={18} />
                Send ETH
              </Link>
            </li>
            <li>
              <Link
                to="/transactions"
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === '/transactions' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List className="mr-2" size={18} />
                Transactions
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === '/settings' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="mr-2" size={18} />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/send' && 'Send ETH'}
            {location.pathname === '/transactions' && 'Transaction History'}
            {location.pathname === '/settings' && 'Settings'}
          </h2>
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center">
                <div className="mr-4 text-right">
                  <div className="text-sm text-gray-600">Connected Wallet</div>
                  <div className="font-medium">{formatAddress(address)}</div>
                  <div className="text-sm text-gray-600">{parseFloat(balance).toFixed(4)} ETH</div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;