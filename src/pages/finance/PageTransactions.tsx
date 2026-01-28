import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TransactionsHeader from '../../components/finance/transactions/TransactionsHeader';
import { TransactionsSearchFilters } from '../../components/finance/transactions/TransactionsSearchFilters';
import { TransactionsQuickActions } from '../../components/finance/transactions/TransactionsQuickActions';
import TransactionsTable from '../../components/finance/transactions/TransactionsTable';
// Import AddTransactionModal, ReconcileModal, etc.

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
  
  // Sample transactions data
  const transactionsData: TransactionItem[] = [
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
  ];

  // Filter data based on search term and filters
  const filterTransactions = () => {
    let filtered = transactionsData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Apply date range filter (simplified for demo)
    if (dateRange === 'Today') {
      filtered = filtered.filter(transaction => transaction.date === '2024-02-08');
    } else if (dateRange === 'This Week') {
      filtered = filtered.filter(transaction => 
        ['2024-02-05', '2024-02-06', '2024-02-07', '2024-02-08'].includes(transaction.date)
      );
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
    // Implement reconciliation logic
  };

  const handleAddTransaction = () => {
    console.log('Add transaction clicked');
    // Open add transaction modal
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
    // Handle export
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

      {/* AddTransactionModal, ReconcileModal and other modals would be added here */}
    </motion.div>
  );
}

export default PageTransactions;