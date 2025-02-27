import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useTransaction } from '../contexts/TransactionContext';
import { ArrowUpRight, ArrowDownLeft, Clock, Search, ExternalLink } from 'lucide-react';

const TransactionStatus: React.FC = () => {
  const { isConnected, address } = useWallet();
  const { getTransactionHistory, loading } = useTransaction();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isConnected) {
      fetchTransactions();
    }
  }, [isConnected]);

  const fetchTransactions = async () => {
    const txs = await getTransactionHistory();
    setTransactions(txs);
    setFilteredTransactions(txs);
  };

  useEffect(() => {
    filterTransactions();
  }, [filter, searchQuery, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.status === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(query) ||
        tx.from.toLowerCase().includes(query) ||
        tx.to.toLowerCase().includes(query)
      );
    }
    
    setFilteredTransactions(filtered);
  };

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

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
        <p>Please connect your wallet to view transaction history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h3 className="text-xl font-semibold mb-2 md:mb-0">Transaction History</h3>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by address or hash"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="failed">Failed</option>
            </select>
            
            <button
              onClick={fetchTransactions}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Refresh
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From/To
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((tx) => (
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
                        {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 6)}
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a 
                        href={`https://etherscan.io/tx/${tx.hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your search or filter criteria
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Status Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-md">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <h4 className="font-medium">Pending</h4>
            </div>
            <p className="text-sm text-gray-600">
              Transaction has been submitted to the network but not yet confirmed in a block.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-md">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <h4 className="font-medium">Confirmed</h4>
            </div>
            <p className="text-sm text-gray-600">
              Transaction has been included in a block and confirmed by the network.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-md">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <h4 className="font-medium">Failed</h4>
            </div>
            <p className="text-sm text-gray-600">
              Transaction was rejected by the network due to an error or insufficient gas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;