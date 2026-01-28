import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReportsHeader from '../../components/finance/reports/ReportsHeader';
import { ReportsSearchFilters } from '../../components/finance/reports/ReportsSearchFilters';
import { ReportsStats } from '../../components/finance/reports/ReportsStat';
import ReportsTable from '../../components/finance/reports/ReportsTable';
import { QuickRunReports } from '../../components/finance/reports/QuickRunReports';

interface ReportItem {
  id: number;
  name: string;
  description: string;
  type: 'Financial' | 'Analytical' | 'Operational' | 'Compliance';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  lastRun: string;
  status: 'Scheduled' | 'Ready' | 'Running' | 'Error';
  size: string;
}

function PageReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
  const reports: ReportItem[] = [
    { id: 1, name: 'Trial Balance', description: 'Complete listing of all general ledger account balances', type: 'Financial', frequency: 'Monthly', lastRun: '2024-01-31', status: 'Ready', size: '2.4 MB' },
    { id: 2, name: 'Profit & Loss Statement', description: 'Summary of revenues, costs and expenses during a specific period', type: 'Financial', frequency: 'Monthly', lastRun: '2024-01-31', status: 'Ready', size: '1.8 MB' },
    { id: 3, name: 'Balance Sheet', description: 'Snapshot of company assets, liabilities and equity', type: 'Financial', frequency: 'Monthly', lastRun: '2024-01-31', status: 'Ready', size: '2.1 MB' },
    { id: 4, name: 'Cash Flow Statement', description: 'Summary of cash inflows and outflows', type: 'Financial', frequency: 'Monthly', lastRun: '2024-01-31', status: 'Ready', size: '1.5 MB' },
    { id: 5, name: 'Aging Report - AR', description: 'Accounts receivable aging by customer', type: 'Analytical', frequency: 'Weekly', lastRun: '2024-02-05', status: 'Ready', size: '3.2 MB' },
    { id: 6, name: 'Aging Report - AP', description: 'Accounts payable aging by vendor', type: 'Analytical', frequency: 'Weekly', lastRun: '2024-02-05', status: 'Ready', size: '2.9 MB' },
    { id: 7, name: 'General Ledger Detail', description: 'Detailed transaction listing for all accounts', type: 'Operational', frequency: 'Daily', lastRun: '2024-02-06', status: 'Ready', size: '45.2 MB' },
    { id: 8, name: 'Journal Entry Listing', description: 'All journal entries for the period', type: 'Operational', frequency: 'Daily', lastRun: '2024-02-06', status: 'Running', size: '12.7 MB' },
    { id: 9, name: 'VAT/TAX Report', description: 'Value Added Tax reporting', type: 'Compliance', frequency: 'Monthly', lastRun: '2024-01-31', status: 'Ready', size: '0.9 MB' },
    { id: 10, name: 'Audit Trail Report', description: 'Complete audit trail of all transactions', type: 'Compliance', frequency: 'Monthly', lastRun: '2024-01-31', status: 'Scheduled', size: '156.3 MB' },
  ];

  // Filter data based on search term and type
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  // Handler functions
  const handleViewReport = (reportId: number) => {
    console.log(`Viewing report ${reportId}`);
  };

  const handleExportReport = (reportId: number, format: 'PDF' | 'Excel' | 'CSV') => {
    console.log(`Exporting report ${reportId} as ${format}`);
  };

  const handleScheduleReport = (reportId: number) => {
    console.log(`Scheduling report ${reportId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ReportsHeader />
      
      <ReportsStats />
      
      <ReportsSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <ReportsTable
        data={filteredReports}
        onViewReport={handleViewReport}
        onExportReport={handleExportReport}
        onScheduleReport={handleScheduleReport}
      />

      <QuickRunReports />
    </motion.div>
  );
}

export default PageReports;