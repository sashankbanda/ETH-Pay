import React, { createContext, useState, useContext } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWallet } from './WalletContext';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  sendTransaction: (to: string, amount: string, gasPrice?: string) => Promise<string | null>;
  getTransactionStatus: (hash: string) => Promise<string>;
  getTransactionHistory: () => Promise<Transaction[]>;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { signer, address, provider } = useWallet();

  const ETHERSCAN_API_KEY = 'YourEtherscanAPIKey'; // Replace with your actual API key
  const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

  const sendTransaction = async (to: string, amount: string, gasPrice?: string): Promise<string | null> => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const tx = {
        to,
        value: ethers.parseEther(amount)
      };

      if (gasPrice) {
        tx.gasPrice = ethers.parseUnits(gasPrice, 'gwei');
      }

      const transaction = await signer.sendTransaction(tx);
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        from: address,
        to,
        amount,
        timestamp: Date.now(),
        status: 'pending',
        hash: transaction.hash
      };

      setTransactions([newTransaction, ...transactions]);
      
      // Save to localStorage
      const storedTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
      localStorage.setItem('transactions', JSON.stringify([newTransaction, ...storedTxs]));
      
      return transaction.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionStatus = async (hash: string): Promise<string> => {
    if (!provider) {
      throw new Error('Provider not available');
    }

    try {
      const tx = await provider.getTransaction(hash);
      if (!tx) return 'pending';

      const receipt = await provider.getTransactionReceipt(hash);
      if (!receipt) return 'pending';

      return receipt.status ? 'confirmed' : 'failed';
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return 'failed';
    }
  };

  const getTransactionHistory = async (): Promise<Transaction[]> => {
    if (!address) {
      return [];
    }

    setLoading(true);
    try {
      // First, get transactions from localStorage
      const storedTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Then, try to get transactions from Etherscan API
      const response = await axios.get(ETHERSCAN_API_URL, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: ETHERSCAN_API_KEY
        }
      });

      if (response.data.status === '1') {
        const etherscanTxs = response.data.result.map((tx: any) => ({
          id: tx.hash,
          from: tx.from,
          to: tx.to,
          amount: ethers.formatEther(tx.value),
          timestamp: parseInt(tx.timeStamp) * 1000,
          status: tx.confirmations > 12 ? 'confirmed' : 'pending',
          hash: tx.hash
        }));

        // Merge and deduplicate transactions
        const allTxs = [...storedTxs, ...etherscanTxs];
        const uniqueTxs = Array.from(new Map(allTxs.map(tx => [tx.hash, tx])).values());
        
        setTransactions(uniqueTxs);
        return uniqueTxs;
      }
      
      setTransactions(storedTxs);
      return storedTxs;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      const storedTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
      setTransactions(storedTxs);
      return storedTxs;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        sendTransaction,
        getTransactionStatus,
        getTransactionHistory,
        loading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};