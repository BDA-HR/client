import React, { useState } from 'react';
import { GlSearchFilters } from './GlSearchFilters';
import { GlTable } from './GlTable';

interface JournalEntry {
  id: number;
  date: string;
  number: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
  status: string;
}

export const GlJournalsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Journal entries sample data
  const journalEntries: JournalEntry[] = [
    { id: 1, date: '2024-01-15', number: 'JV-001', description: 'Office Supplies Purchase', debit: 1500, credit: 0, account: 'Office Expenses', status: 'Posted' },
    { id: 2, date: '2024-01-16', number: 'JV-002', description: 'Customer Payment Received', debit: 0, credit: 10000, account: 'Accounts Receivable', status: 'Posted' },
    { id: 3, date: '2024-01-17', number: 'JV-003', description: 'Monthly Depreciation', debit: 5000, credit: 5000, account: 'Depreciation Expense/Accumulated Depreciation', status: 'Pending' },
    { id: 4, date: '2024-01-18', number: 'JV-004', description: 'Salary Accrual', debit: 45000, credit: 45000, account: 'Salaries Payable/Salary Expense', status: 'Approved' },
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

  const handleAddJournal = () => {
    console.log('Add new journal');
  };

  // Filter data based on search term
  const filteredJournals = journalEntries.filter(journal =>
    journal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.account.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <GlSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddNew={handleAddJournal}
        type="journals"
      />
      
      <GlTable
        data={filteredJournals}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredJournals.length / 10)}
        totalItems={filteredJournals.length}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        type="journals"
      />
    </div>
  );
};