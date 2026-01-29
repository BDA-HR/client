import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Download, Filter, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { showToast } from '../../layout/layout';
import { mockAnalytics, mockLeads, mockContacts, mockOpportunities, mockActivities, mockSupportTickets } from '../../data/crmMockData';
import DashboardBuilder from '../../components/crm/analytics/components/DashboardBuilder';
import ReportBuilder from '../../components/crm/analytics/components/ReportBuilder';
import KPICards from '../../components/crm/analytics/components/KPICards';
import FunnelAnalysis from '../../components/crm/analytics/components/FunnelAnalysis';

export default function AnalyticsReporting() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'reports' | 'kpis' | 'funnel'>('dashboard');
  const [dateRange, setDateRange] = useState('30d');

  // Calculate analytics data
  const analyticsData = {
    ...mockAnalytics,
    totalLeads: mockLeads.length,
    totalContacts: mockContacts.length,
    totalOpportunities: mockOpportunities.length,
    totalActivities: mockActivities.length,
    totalTickets: mockSupportTickets.length,
    
    // Lead metrics
    newLeads: mockLeads.filter(l => {
      const createdDate = new Date(l.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length,
    
    qualifiedLeads: mockLeads.filter(l => l.status === 'Qualified').length,
    convertedLeads: mockLeads.filter(l => l.status === 'Closed Won').length,
    
    // Opportunity metrics
    openOpportunities: mockOpportunities.filter(o => !['Closed Won', 'Closed Lost'].includes(o.stage)).length,
    wonOpportunities: mockOpportunities.filter(o => o.stage === 'Closed Won').length,
    lostOpportunities: mockOpportunities.filter(o => o.stage === 'Closed Lost').length,
    
    // Activity metrics
    completedActivities: mockActivities.filter(a => a.status === 'Completed').length,
    pendingActivities: mockActivities.filter(a => a.status === 'Pending').length,
    overdueActivities: mockActivities.filter(a => {
      const scheduledDate = new Date(a.scheduledDate);
      const now = new Date();
      return scheduledDate < now && a.status !== 'Completed';
    }).length,
    
    // Support metrics
    openTickets: mockSupportTickets.filter(t => !['Resolved', 'Closed'].includes(t.status)).length,
    resolvedTickets: mockSupportTickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length,
    avgResolutionTime: mockSupportTickets
      .filter(t => t.resolutionTime)
      .reduce((sum, t) => sum + (t.resolutionTime || 0), 0) / 
      mockSupportTickets.filter(t => t.resolutionTime).length || 0
  };

  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    showToast.success(`Exporting data as ${format.toUpperCase()}...`);
    // In a real app, this would trigger the actual export
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'dashboard' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1 inline" />
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('reports')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'reports' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChart className="w-4 h-4 mr-1 inline" />
              Reports
            </button>
            <button
              onClick={() => setViewMode('kpis')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'kpis' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-1 inline" />
              KPIs
            </button>
            <button
              onClick={() => setViewMode('funnel')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'funnel' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Filter className="w-4 h-4 mr-1 inline" />
              Funnel
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('csv')}
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('pdf')}
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('excel')}
              >
                <Download className="w-4 h-4 mr-1" />
                Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Leads</p>
            <p className="text-2xl font-bold text-orange-600">{analyticsData.totalLeads}</p>
            <p className="text-xs text-gray-500">+{analyticsData.newLeads} this month</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Opportunities</p>
            <p className="text-2xl font-bold text-blue-600">{analyticsData.totalOpportunities}</p>
            <p className="text-xs text-gray-500">{analyticsData.openOpportunities} open</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
            <p className="text-2xl font-bold text-green-600">${(analyticsData.pipelineValue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500">Total pipeline</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Win Rate</p>
            <p className="text-2xl font-bold text-purple-600">{analyticsData.winRate}%</p>
            <p className="text-xs text-gray-500">Closed deals</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Activities</p>
            <p className="text-2xl font-bold text-indigo-600">{analyticsData.totalActivities}</p>
            <p className="text-xs text-gray-500">{analyticsData.completedActivities} completed</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Support Tickets</p>
            <p className="text-2xl font-bold text-red-600">{analyticsData.totalTickets}</p>
            <p className="text-xs text-gray-500">{analyticsData.openTickets} open</p>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'dashboard' && (
        <DashboardBuilder 
          analyticsData={analyticsData}
          dateRange={dateRange}
        />
      )}

      {viewMode === 'reports' && (
        <ReportBuilder 
          analyticsData={analyticsData}
          dateRange={dateRange}
          onExport={handleExportData}
        />
      )}

      {viewMode === 'kpis' && (
        <KPICards 
          analyticsData={analyticsData}
          dateRange={dateRange}
        />
      )}

      {viewMode === 'funnel' && (
        <FunnelAnalysis 
          analyticsData={analyticsData}
          leads={mockLeads}
          opportunities={mockOpportunities}
          dateRange={dateRange}
        />
      )}
    </motion.div>
  );
}