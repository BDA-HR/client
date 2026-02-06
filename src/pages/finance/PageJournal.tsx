import { useState } from 'react';
import JournalHeader from '../../components/finance/journal/JournalHeader';
import { JournalsSearchFilters } from '../../components/finance/journal/JournalsSearchFilters';
import JournalsTable from '../../components/finance/journal/JournalTable';
import AddJournalModal from '../../components/finance/journal/AddJournalModal';

interface JournalEntry {
  id: number;
  date: string;
  number: string;
  debit: number;
  credit: number;
  account: string;
  status: string;
}

function PageJournal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Journal entries sample data
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { id: 1, date: '2024-01-15', number: 'JV-001', debit: 1500, credit: 0, account: 'Office Expenses', status: 'Posted' },
    { id: 2, date: '2024-01-16', number: 'JV-002', debit: 0, credit: 10000, account: 'Accounts Receivable', status: 'Posted' },
    { id: 3, date: '2024-01-17', number: 'JV-003', debit: 5000, credit: 5000, account: 'Depreciation Expense/Accumulated Depreciation', status: 'Pending' },
    { id: 4, date: '2024-01-18', number: 'JV-004', debit: 45000, credit: 45000, account: 'Salaries Payable/Salary Expense', status: 'Approved' },
    { id: 5, date: '2024-01-19', number: 'JV-005', debit: 25000, credit: 2500, account: 'Equipment', status: 'Posted' },
    { id: 6, date: '2024-01-20', number: 'JV-06', debit: 35789.99, credit: 35789.99, account: 'Utilities Payable/Utilities Expense', status: 'Draft' },
    { id: 7, date: '2024-01-21', number: 'JV-007', debit: 3500, credit: 3500, account: 'Utilities Payable/Utilities Expense', status: 'Draft' },
  ]);

  // Table handlers
  const handleViewDetails = (item: any) => {
    console.log('View details:', item);
  };

  const handleEdit = (item: any) => {
    console.log('Edit:', item);
  };

  const handleDelete = (item: any) => {
    console.log('Delete:', item);
    setJournalEntries(prev => prev.filter(entry => entry.id !== item.id));
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle adding new journal entry
  const handleAddJournal = async (journalData: any) => {
    console.log('Adding new journal:', journalData);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalDebit = journalData.lines.reduce((sum: number, line: any) => sum + line.debit, 0);
        const totalCredit = journalData.lines.reduce((sum: number, line: any) => sum + line.credit, 0);
        const firstAccount = journalData.lines[0]?.accountName || 'Multiple Accounts';
        
        const newJournal: JournalEntry = {
          id: journalEntries.length + 1,
          date: journalData.date,
          number: journalData.journalNumber,
          debit: totalDebit,
          credit: totalCredit,
          account: journalData.lines.length > 1 
            ? `${firstAccount} (+${journalData.lines.length - 1} more)` 
            : firstAccount,
          status: journalData.status.charAt(0).toUpperCase() + journalData.status.slice(1)
        };
        
        setJournalEntries(prev => [newJournal, ...prev]);
        
        resolve({ data: { message: 'Journal entry created successfully!' } });
      }, 1500);
    });
  };

  // Filter data based on search term
  const filteredJournals = journalEntries.filter(journal =>
    journal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <JournalHeader />
      
      <JournalsSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddNew={handleOpenAddModal}
      />

      <AddJournalModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddJournal={handleAddJournal}
      />

      <JournalsTable
        data={filteredJournals}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredJournals.length / 10)}
        totalItems={filteredJournals.length}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default PageJournal;