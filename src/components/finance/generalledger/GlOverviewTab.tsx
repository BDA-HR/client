import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap,
  Plus,
  FileSpreadsheet,
  Calendar,
  BarChart3,
  Clock,
} from 'lucide-react';
import { GlSearchFilters } from './GlSearchFilters';

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

export const GlOverviewTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const journalEntries: JournalEntry[] = [
    { id: 1, date: '2024-01-15', number: 'JV-001', description: 'Office Supplies Purchase', debit: 1500, credit: 0, account: 'Office Expenses', status: 'Posted' },
    { id: 2, date: '2024-01-16', number: 'JV-002', description: 'Customer Payment Received', debit: 0, credit: 10000, account: 'Accounts Receivable', status: 'Posted' },
    { id: 3, date: '2024-01-17', number: 'JV-003', description: 'Monthly Depreciation', debit: 5000, credit: 5000, account: 'Depreciation Expense/Accumulated Depreciation', status: 'Pending' },
    { id: 4, date: '2024-01-18', number: 'JV-004', description: 'Salary Accrual', debit: 45000, credit: 45000, account: 'Salaries Payable/Salary Expense', status: 'Approved' },
  ];

  const handleAddNew = () => {
    console.log('Add new journal from overview');
  };

  // Filter data based on search term
  const filteredJournals = journalEntries.filter(journal =>
    journal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.account.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search Filters */}
      <GlSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddNew={handleAddNew}
        type="journals"
      />

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200">
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 text-indigo-900">
          <Zap className="w-5 h-5 text-indigo-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              icon: <Plus className="w-6 h-6" />, 
              label: 'New Journal', 
              color: 'from-indigo-500 to-indigo-600',
              action: () => console.log('New Journal clicked')
            },
            { 
              icon: <FileSpreadsheet className="w-6 h-6" />, 
              label: 'Export Trial Balance', 
              color: 'from-indigo-500 to-indigo-600',
              action: () => console.log('Export Trial Balance clicked')
            },
            { 
              icon: <Calendar className="w-6 h-6" />, 
              label: 'Period Close', 
              color: 'from-indigo-500 to-indigo-600',
              action: () => console.log('Period Close clicked')
            },
            { 
              icon: <BarChart3 className="w-6 h-6" />, 
              label: 'Run Reports', 
              color: 'from-indigo-500 to-indigo-600',
              action: () => console.log('Run Reports clicked')
            }
          ].map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${action.color} text-white p-4 rounded-xl hover:shadow-lg transition-all flex flex-col items-center justify-center space-y-2`}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-indigo-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Recent Journal Entries</span>
          </h2>
          <div className="text-sm text-indigo-600">
            Showing {filteredJournals.length} of {journalEntries.length} entries
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-indigo-200">
                <th className="text-left py-3 px-4 text-indigo-700 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-indigo-700 font-medium">Journal #</th>
                <th className="text-left py-3 px-4 text-indigo-700 font-medium">Description</th>
                <th className="text-left py-3 px-4 text-indigo-700 font-medium">Debit</th>
                <th className="text-left py-3 px-4 text-indigo-700 font-medium">Credit</th>
                <th className="text-left py-3 px-4 text-indigo-700 font-medium">Account</th>
                <th className="text-left py-3 px-4 text-indigo-700 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredJournals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-indigo-500">
                    No journal entries found.
                  </td>
                </tr>
              ) : (
                filteredJournals.map((entry) => (
                  <tr key={entry.id} className="border-b border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                    <td className="py-3 px-4 text-indigo-900">{entry.date}</td>
                    <td className="py-3 px-4 font-medium text-indigo-800">{entry.number}</td>
                    <td className="py-3 px-4 text-indigo-900">{entry.description}</td>
                    <td className="py-3 px-4">
                      {entry.debit > 0 && (
                        <span className="text-indigo-700 font-medium">${entry.debit.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {entry.credit > 0 && (
                        <span className="text-indigo-700 font-medium">${entry.credit.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-indigo-700">
                      {entry.account}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'Active' ? 'bg-indigo-100 text-indigo-800' :
                        entry.status === 'Posted' ? 'bg-indigo-100 text-indigo-800' :
                        entry.status === 'Pending' ? 'bg-indigo-50 text-indigo-700' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Total Debits</p>
              <p className="text-xl font-bold text-indigo-900">
                ${journalEntries.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Total Credits</p>
              <p className="text-xl font-bold text-indigo-900">
                ${journalEntries.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Recent Entries</p>
              <p className="text-xl font-bold text-indigo-900">{journalEntries.length}</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};