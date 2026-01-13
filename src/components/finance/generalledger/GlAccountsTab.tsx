import React, { useState } from 'react';
import { GlSearchFilters } from './GlSearchFilters';
import { GlTable } from './GlTable';

interface AccountItem {
  id: number;
  code: string;
  name: string;
  type: string;
  level: number;
  balance: number;
  status: string;
}

export const GlAccountsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Chart of Accounts sample data
  const chartOfAccounts: AccountItem[] = [
    { id: 1, code: '1000', name: 'Current Assets', type: 'Asset', level: 1, balance: 500000, status: 'Active' },
    { id: 2, code: '1100', name: 'Cash & Bank', type: 'Asset', level: 2, balance: 150000, status: 'Active' },
    { id: 3, code: '1200', name: 'Accounts Receivable', type: 'Asset', level: 2, balance: 250000, status: 'Active' },
    { id: 4, code: '2000', name: 'Current Liabilities', type: 'Liability', level: 1, balance: 300000, status: 'Active' },
    { id: 5, code: '3000', name: 'Equity', type: 'Equity', level: 1, balance: 200000, status: 'Active' },
    { id: 6, code: '4000', name: 'Revenue', type: 'Revenue', level: 1, balance: 800000, status: 'Active' },
    { id: 7, code: '5000', name: 'Expenses', type: 'Expense', level: 1, balance: 450000, status: 'Active' },
  ];

  // Table handlers
  const handleViewDetails = (item: any) => {
    console.log('View details:', item);
  };

  const handleEdit = (item: any) => {
    console.log('Edit:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete:', item);
  };

  const handleAddAccount = () => {
    console.log('Add new account');
  };

  // Filter data based on search term
  const filteredAccounts = chartOfAccounts.filter(account =>
    account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <GlSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddNew={handleAddAccount}
        type="accounts"
      />
      
      <GlTable
        data={filteredAccounts}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredAccounts.length / 10)}
        totalItems={filteredAccounts.length}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        type="accounts"
      />
    </div>
  );
};