import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useTransaction } from '../contexts/TransactionContext';
import { ethers } from 'ethers';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const SendETH: React.FC = () => {
  const { isConnected, balance } = useWallet();
  const { sendTransaction, loading } = useTransaction();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');

  const validateAddress = (address: string) => {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTxHash('');

    // Validate inputs
    if (!recipient || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateAddress(recipient)) {
      setError('Invalid Ethereum address');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      setError('Insufficient balance');
      return;
    }

    try {
      const hash = await sendTransaction(recipient, amount, gasPrice);
      if (hash) {
        setSuccess('Transaction sent successfully!');
        setTxHash(hash);
        setRecipient('');
        setAmount('');
        setGasPrice('');
      } else {
        setError('Transaction failed. Please try again.');
      }
    } catch (error: any) {
      setError(error.message || 'Transaction failed. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p>Please connect your wallet to send ETH.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">Send ETH</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
            <CheckCircle size={20} className="mr-2" />
            {success}
            {txHash && (
              <div className="mt-2 text-sm">
                Transaction Hash: 
                <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:underline"
                >
                  {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                </a>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address *
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETH) *
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
                step="0.0001"
                min="0"
                required
              />
              <div className="absolute right-3 top-2 text-gray-500 text-sm">
                Balance: {parseFloat(balance).toFixed(4)} ETH
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="gasPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Gas Price (Gwei) <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="number"
              id="gasPrice"
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Default"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use the network's suggested gas price
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader size={20} className="animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              'Send ETH'
            )}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h4 className="text-lg font-semibold mb-4">Transaction Information</h4>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium">Ethereum Mainnet</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Estimated Gas:</span>
            <span className="font-medium">21,000 units</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Confirmation Time:</span>
            <span className="font-medium">~15 seconds</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SendETH;