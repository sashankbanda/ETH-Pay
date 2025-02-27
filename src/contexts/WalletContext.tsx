import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    // Check if wallet was previously connected
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      checkIfWalletIsConnected();
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          const ethSigner = await ethProvider.getSigner();
          const account = accounts[0];
          const ethBalance = await ethProvider.getBalance(account);
          
          setProvider(ethProvider);
          setSigner(ethSigner);
          setAddress(account);
          setBalance(ethers.formatEther(ethBalance));
          setIsConnected(true);
          localStorage.setItem('walletAddress', account);
        }
      }
    } catch (error) {
      console.error('Error checking if wallet is connected:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const ethSigner = await ethProvider.getSigner();
      const account = accounts[0];
      const ethBalance = await ethProvider.getBalance(account);
      
      setProvider(ethProvider);
      setSigner(ethSigner);
      setAddress(account);
      setBalance(ethers.formatEther(ethBalance));
      setIsConnected(true);
      localStorage.setItem('walletAddress', account);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnectWallet();
        } else {
          setAddress(newAccounts[0]);
          localStorage.setItem('walletAddress', newAccounts[0]);
          updateBalance(newAccounts[0], ethProvider);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const updateBalance = async (address: string, provider: ethers.BrowserProvider) => {
    try {
      const ethBalance = await provider.getBalance(address);
      setBalance(ethers.formatEther(ethBalance));
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
    setProvider(null);
    setSigner(null);
    localStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connectWallet,
        disconnectWallet,
        provider,
        signer
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};