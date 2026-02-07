import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TransactionsHeader from '../../components/finance/transactions/TransactionsHeader';
import { TransactionsSearchFilters } from '../../components/finance/transactions/TransactionsSearchFilters';
import { TransactionsQuickActions } from '../../components/finance/transactions/TransactionsQuickActions';
import TransactionsTable from '../../components/finance/transactions/TransactionsTable';
import AddTransactionModal  from '../../components/finance/transactions/AddTransactionModal';
import type { TransactionFormData } from '../../components/finance/transactions/AddTransactionModal';

interface TransactionItem {
  id: number;
  date: string;
  reference: string;
  description: string;
  type: 'Income' | 'Expense' | 'Transfer' | 'Refund';
  amount: number;
  account: string;
  category: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Reconciled';
  balance: number;
}

function PageTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterAccount, setFilterAccount] = useState('All');
  const [dateRange, setDateRange] = useState('This Month');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Sample transactions data
  const [transactionsData, setTransactionsData] = useState<TransactionItem[]>([
    { id: 1, date: '2024-02-01', reference: 'TXN-001', description: 'Monthly Software Subscription', type: 'Expense', amount: 299.99, account: 'Checking', category: 'Software & Tools', status: 'Completed', balance: 45000 },
    { id: 2, date: '2024-02-01', reference: 'TXN-002', description: 'Client Payment - Project Alpha', type: 'Income', amount: 15000, account: 'Checking', category: 'Client Payments', status: 'Completed', balance: 60000 },
    { id: 3, date: '2024-02-02', reference: 'TXN-003', description: 'Office Rent Payment', type: 'Expense', amount: 5000, account: 'Checking', category: 'Rent & Utilities', status: 'Completed', balance: 55000 },
    { id: 4, date: '2024-02-02', reference: 'TXN-004', description: 'Employee Salary Transfer', type: 'Transfer', amount: 25000, account: 'Checking', category: 'Payroll', status: 'Pending', balance: 30000 },
    { id: 5, date: '2024-02-03', reference: 'TXN-005', description: 'Marketing Campaign Payment', type: 'Expense', amount: 7500, account: 'Credit Card', category: 'Marketing', status: 'Completed', balance: 22500 },
    { id: 6, date: '2024-02-03', reference: 'TXN-006', description: 'Interest Earned - Savings', type: 'Income', amount: 150.25, account: 'Savings', category: 'Interest Income', status: 'Completed', balance: 10150.25 },
    { id: 7, date: '2024-02-04', reference: 'TXN-007', description: 'Supplier Invoice Payment', type: 'Expense', amount: 8200, account: 'Checking', category: 'Supplier Payments', status: 'Completed', balance: 14300 },
    { id: 8, date: '2024-02-04', reference: 'TXN-008', description: 'Consulting Fee Received', type: 'Income', amount: 3500, account: 'Checking', category: 'Consulting Fees', status: 'Reconciled', balance: 17800 },
    { id: 9, date: '2024-02-05', reference: 'TXN-009', description: 'Equipment Purchase Refund', type: 'Refund', amount: 1200, account: 'Checking', category: 'Refunds', status: 'Completed', balance: 19000 },
    { id: 10, date: '2024-02-05', reference: 'TXN-010', description: 'Monthly Internet Bill', type: 'Expense', amount: 89.99, account: 'Credit Card', category: 'Utilities', status: 'Failed', balance: 18910.01 },
    { id: 11, date: '2024-02-06', reference: 'TXN-011', description: 'Transfer to Investment Account', type: 'Transfer', amount: 5000, account: 'Checking', category: 'Investments', status: 'Completed', balance: 13910.01 },
    { id: 12, date: '2024-02-06', reference: 'TXN-012', description: 'Customer Overpayment Refund', type: 'Refund', amount: 250, account: 'Checking', category: 'Refunds', status: 'Pending', balance: 13660.01 },
    { id: 13, date: '2024-02-07', reference: 'TXN-013', description: 'Annual Software License', type: 'Expense', amount: 4800, account: 'Credit Card', category: 'Software & Tools', status: 'Completed', balance: 8860.01 },
    { id: 14, date: '2024-02-07', reference: 'TXN-014', description: 'Freelancer Payment', type: 'Expense', amount: 3200, account: 'Checking', category: 'Contractor Payments', status: 'Completed', balance: 5660.01 },
    { id: 15, date: '2024-02-08', reference: 'TXN-015', description: 'Revenue Share Payment Received', type: 'Income', amount: 8900, account: 'Checking', category: 'Revenue Share', status: 'Completed', balance: 14560.01 },
  ]);

  // Calculate transaction statistics
  const calculateTransactionStats = () => {
    const totalIncome = transactionsData
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactionsData
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netFlow = totalIncome - totalExpenses;
    const pendingCount = transactionsData.filter(t => t.status === 'Pending').length;
    const reconciledCount = transactionsData.filter(t => t.status === 'Reconciled').length;
    
    return {
      totalIncome: Math.round(totalIncome),
      totalExpenses: Math.round(totalExpenses),
      netFlow: Math.round(netFlow),
      pendingCount,
      reconciledCount,
      totalTransactions: transactionsData.length
    };
  };

  const stats = calculateTransactionStats();

  // Filter data based on search term and filters
  const filterTransactions = () => {
    let filtered = transactionsData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm)
      );
    }

    // Apply type filter
    if (filterType !== 'All') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    // Apply account filter
    if (filterAccount !== 'All') {
      filtered = filtered.filter(transaction => transaction.account === filterAccount);
    }

    // Apply date range filter
    if (dateRange === 'Today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(transaction => transaction.date === today);
    } else if (dateRange === 'This Week') {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      filtered = filtered.filter(transaction => {
        const transDate = new Date(transaction.date);
        return transDate >= weekStart && transDate <= weekEnd;
      });
    } else if (dateRange === 'Last Month') {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      
      filtered = filtered.filter(transaction => {
        const transDate = new Date(transaction.date);
        return transDate >= lastMonth && transDate <= lastMonthEnd;
      });
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions();

  // Handler functions
  const handleViewDetails = (item: TransactionItem) => {
    console.log('View transaction details:', item);
    // Implement view details logic
  };

  const handleEdit = (item: TransactionItem) => {
    console.log('Edit transaction:', item);
    // Implement edit logic
  };

  const handleCategorize = (item: TransactionItem) => {
    console.log('Categorize transaction:', item);
    // Implement categorization logic
  };

  const handleReconcile = (item: TransactionItem) => {
    console.log('Reconcile transaction:', item);
    // Update transaction status to reconciled
    setTransactionsData(prev => prev.map(t => 
      t.id === item.id ? { ...t, status: 'Reconciled' as const } : t
    ));
  };

  const handleAddTransaction = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewTransaction = async (transactionData: TransactionFormData) => {
    console.log('Adding new transaction:', transactionData);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a new unique ID
        const newId = Math.max(...transactionsData.map(t => t.id)) + 1;
        
        // Map form data to TransactionItem
        const accountNames: Record<string, string> = {
          'checking': 'Checking',
          'savings': 'Savings',
          'credit-card': 'Credit Card',
          'paypal': 'PayPal',
          'cash': 'Petty Cash'
        };
        
        // Calculate new balance
        const lastTransaction = transactionsData
          .filter(t => t.account === accountNames[transactionData.account])
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        const currentBalance = lastTransaction?.balance || 0;
        const amountChange = transactionData.type === 'Income' 
          ? transactionData.amount 
          : transactionData.type === 'Expense' 
            ? -transactionData.amount 
            : 0;
        
        const newTransaction: TransactionItem = {
          id: newId,
          date: transactionData.date,
          reference: transactionData.reference,
          description: transactionData.description,
          type: transactionData.type,
          amount: transactionData.amount,
          account: accountNames[transactionData.account] || transactionData.account,
          category: transactionData.category,
          status: 'Completed',
          balance: currentBalance + amountChange
        };
        
        // Add the new transaction to the state
        setTransactionsData(prev => [newTransaction, ...prev].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
        
        resolve({ 
          data: { 
            message: 'Transaction added successfully!', 
            transaction: newTransaction
          } 
        });
      }, 1500);
    });
  };

  const handleImportStatement = () => {
    console.log('Import statement clicked');
    // Open import modal
  };

  const handleReconcileAccounts = () => {
    console.log('Reconcile accounts clicked');
    // Open reconciliation tool
  };

  const handleTransferFunds = () => {
    console.log('Transfer funds clicked');
    // Open transfer modal
  };

  const handleGenerateReports = () => {
    console.log('Generate reports clicked');
    // Open report generation
  };

  const handleExportData = () => {
    console.log('Export data clicked');
    
    // Create CSV content
    const headers = ['Date', 'Reference', 'Description', 'Type', 'Amount', 'Account', 'Category', 'Status', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        t.reference,
        `"${t.description}"`,
        t.type,
        t.amount,
        t.account,
        t.category,
        t.status,
        t.balance
      ].join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <TransactionsHeader />
      
      <TransactionsQuickActions
        onAddTransaction={handleAddTransaction}
        onImportStatement={handleImportStatement}
        onReconcileAccounts={handleReconcileAccounts}
        onTransferFunds={handleTransferFunds}
        onGenerateReports={handleGenerateReports}
        onExportData={handleExportData}
      />

      <TransactionsSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterAccount={filterAccount}
        setFilterAccount={setFilterAccount}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onAddTransaction={handleAddTransaction}
        onExport={handleExportData}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddNewTransaction}
      />

      <TransactionsTable
        data={filteredTransactions}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredTransactions.length / 10)}
        totalItems={filteredTransactions.length}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onCategorize={handleCategorize}
        onReconcile={handleReconcile}
      />

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800">Total Income</p>
              <p className="text-2xl font-bold text-emerald-900">${stats.totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-lg">
              <svg className="h-6 w-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-emerald-700">
            {transactionsData.filter(t => t.type === 'Income').length} income transactions
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-5 rounded-xl border border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-800">Total Expenses</p>
              <p className="text-2xl font-bold text-rose-900">${stats.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-rose-200 rounded-lg">
              <svg className="h-6 w-6 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-rose-700">
            {transactionsData.filter(t => t.type === 'Expense').length} expense transactions
          </div>
        </div>

        <div className={`bg-gradient-to-r p-5 rounded-xl border ${stats.netFlow >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-rose-50 to-rose-100 border-rose-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${stats.netFlow >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
                ${stats.netFlow >= 0 ? '+' : ''}{stats.netFlow.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stats.netFlow >= 0 ? 'bg-emerald-200' : 'bg-rose-200'}`}>
              <svg className={`h-6 w-6 ${stats.netFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className={`mt-2 text-xs ${stats.netFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {stats.netFlow >= 0 ? 'Positive' : 'Negative'} cash flow this period
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Pending</p>
              <p className="text-2xl font-bold text-blue-900">{stats.pendingCount}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-700">
            {stats.reconciledCount} transactions reconciled
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-5 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {transactionsData.slice(0, 5).map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${
                  transaction.type === 'Income' ? 'bg-emerald-500' :
                  transaction.type === 'Expense' ? 'bg-rose-500' :
                  transaction.type === 'Transfer' ? 'bg-blue-500' :
                  'bg-amber-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.reference} • {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'Income' ? 'text-emerald-600' :
                  transaction.type === 'Expense' ? 'text-rose-600' :
                  'text-gray-600'
                }`}>
                  {transaction.type === 'Income' ? '+' : transaction.type === 'Expense' ? '-' : ''}
                  ${transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{transaction.account}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default PageTransactions;