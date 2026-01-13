import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet,
  Download,
  Eye,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Building,
  Globe,
  Search,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

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

export const GlReportsTab: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // Sample reports data
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

  const reportTypes = ['All', 'Financial', 'Analytical', 'Operational', 'Compliance'];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      'Scheduled': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Ready': { bg: 'bg-green-100', text: 'text-green-800' },
      'Running': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Error': { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { bg: string; text: string }> = {
      'Financial': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      'Analytical': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Operational': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
      'Compliance': { bg: 'bg-amber-100', text: 'text-amber-800' },
    };
    const config = typeConfig[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {type}
      </span>
    );
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleRunReport = (reportId: number) => {
    console.log(`Running report ${reportId}`);
    // Implement report running logic here
  };

  const handleExportReport = (reportId: number, format: 'PDF' | 'Excel' | 'CSV') => {
    console.log(`Exporting report ${reportId} as ${format}`);
    // Implement export logic here
  };

  const handleScheduleReport = (reportId: number) => {
    console.log(`Scheduling report ${reportId}`);
    // Implement scheduling logic here
  };

  return (
    <motion.div
      key="reports"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Total Reports</p>
              <p className="text-2xl font-bold text-indigo-900">24</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-600">+3 this month</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Scheduled</p>
              <p className="text-2xl font-bold text-indigo-900">8</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-600">Next: Today, 2:00 PM</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Last 24h Runs</p>
              <p className="text-2xl font-bold text-indigo-900">156</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-600">+12% from yesterday</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Avg. Run Time</p>
              <p className="text-2xl font-bold text-indigo-900">4.2s</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-600">-0.8s from last month</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports by name or description..."
                className="block w-full pl-10 pr-4 py-2 border border-indigo-300 rounded-md leading-5 bg-white placeholder-indigo-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-indigo-700">Filter by:</span>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-indigo-300 rounded-md px-3 py-1 text-sm text-indigo-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-xl border ${selectedReport === report.id ? 'border-indigo-300 shadow-lg' : 'border-indigo-200 shadow-sm'} transition-all duration-200 overflow-hidden`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-indigo-900 mb-1">{report.name}</h3>
                  <p className="text-sm text-indigo-600 mb-2">{report.description}</p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {report.type === 'Financial' && <BarChart3 className="w-5 h-5 text-indigo-500" />}
                  {report.type === 'Analytical' && <PieChart className="w-5 h-5 text-purple-500" />}
                  {report.type === 'Operational' && <FileText className="w-5 h-5 text-cyan-500" />}
                  {report.type === 'Compliance' && <CheckCircle className="w-5 h-5 text-amber-500" />}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {getTypeBadge(report.type)}
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {report.frequency}
                </span>
                {getStatusBadge(report.status)}
              </div>

              <div className="flex items-center justify-between text-sm text-indigo-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Last run: {report.lastRun}
                </div>
                <div className="text-indigo-700 font-medium">{report.size}</div>
              </div>

              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => handleRunReport(report.id)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {selectedReport === report.id ? 'Less' : 'More'}
                  {selectedReport === report.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {selectedReport === report.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-indigo-100"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-indigo-700">Export as:</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExportReport(report.id, 'PDF')}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded transition-colors"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => handleExportReport(report.id, 'Excel')}
                          className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded transition-colors"
                        >
                          Excel
                        </button>
                        <button
                          onClick={() => handleExportReport(report.id, 'CSV')}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition-colors"
                        >
                          CSV
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-indigo-700">Schedule:</span>
                      <button
                        onClick={() => handleScheduleReport(report.id)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded transition-colors flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        Schedule
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-indigo-700">Delivery:</span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-indigo-50 rounded">
                          <Users className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button className="p-1 hover:bg-indigo-50 rounded">
                          <Building className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button className="p-1 hover:bg-indigo-50 rounded">
                          <Globe className="w-4 h-4 text-indigo-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Run Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-xl border border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Quick Run Standard Reports
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Trial Balance', period: 'Current Month', icon: <FileSpreadsheet className="w-4 h-4" /> },
            { name: 'P&L Statement', period: 'YTD', icon: <TrendingUp className="w-4 h-4" /> },
            { name: 'Balance Sheet', period: 'As of Today', icon: <BarChart3 className="w-4 h-4" /> },
            { name: 'Cash Flow', period: 'Last Quarter', icon: <TrendingDown className="w-4 h-4" /> },
          ].map((report, index) => (
            <button
              key={index}
              className="bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg p-4 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  {report.icon}
                </div>
                <Download className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="font-medium text-indigo-900">{report.name}</div>
              <div className="text-xs text-indigo-600 mt-1">{report.period}</div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};