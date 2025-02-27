import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useTransaction } from '../contexts/TransactionContext';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isConnected, address, balance } = useWallet();
  const { getTransactionHistory, transactions } = useTransaction();
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected) {
      getTransactionHistory().then((txs) => {
        setRecentTransactions(txs.slice(0, 5));
      });
    }
  }, [isConnected, getTransactionHistory]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>;
      case 'pending':
        return <Clock size={16} className="text-yellow-500 mr-2" />;
      case 'failed':
        return <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {!isConnected ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Welcome to ETH Pay</h3>
          <p className="mb-4">Connect your wallet to start sending and receiving ETH payments.</p>
          <img 
            src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80" 
            alt="Ethereum" 
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        </div>
      ) : (
        <>
          {/* Wallet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
              <p className="text-3xl font-bold">{parseFloat(balance).toFixed(4)} ETH</p>
              <p className="text-sm text-gray-500 mt-2">Connected: {address}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sent</p>
                  <p className="text-xl font-semibold">
                    {transactions.filter(tx => tx.from.toLowerCase() === address?.toLowerCase()).length} Transactions
                  </p>
                </div>
                <ArrowUpRight size={24} className="text-red-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Received</p>
                  <p className="text-xl font-semibold">
                    {transactions.filter(tx => tx.to.toLowerCase() === address?.toLowerCase()).length} Transactions
                  </p>
                </div>
                <ArrowDownLeft size={24} className="text-green-500" />
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tx.from.toLowerCase() === address?.toLowerCase() ? (
                            <div className="flex items-center">
                              <ArrowUpRight size={16} className="text-red-500 mr-2" />
                              <span>Sent</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ArrowDownLeft size={16} className="text-green-500 mr-2" />
                              <span>Received</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {tx.from.toLowerCase() === address?.toLowerCase() 
                              ? `To: ${tx.to.substring(0, 6)}...${tx.to.substring(tx.to.length - 4)}`
                              : `From: ${tx.from.substring(0, 6)}...${tx.from.substring(tx.from.length - 4)}`
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {parseFloat(tx.amount).toFixed(4)} ETH
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(tx.timestamp)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm flex items-center ${getStatusColor(tx.status)}`}>
                            {getStatusIcon(tx.status)}
                            <span className="capitalize">{tx.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No transactions found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;