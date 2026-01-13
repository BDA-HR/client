import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  Layers,
  FileText,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import { GlHeader } from '../../../components/finance/generalledger/glHeader';
import { GlOverviewTab } from '../../../components/finance/generalledger/GlOverviewTab';
import { GlAccountsTab } from '../../../components/finance/generalledger/GlAccountsTab';
import { GlJournalsTab } from '../../../components/finance/generalledger/GlJournalsTab';
import { GlWorkflowTab } from '../../../components/finance/generalledger/GlWorkflowTab';
import { GlReportsTab } from '../../../components/finance/generalledger/GlReportsTab';
// Define the tab interface
interface GlTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType;
}

const glTabs: GlTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    component: GlOverviewTab,
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: Layers,
    component: GlAccountsTab,
  },
  {
    id: 'journals',
    label: 'Journals',
    icon: FileText,
    component: GlJournalsTab,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileSpreadsheet,
    component: GlReportsTab,
  },
  {
    id: 'workflow',
    label: 'Workflow',
    icon: RefreshCw,
    component: GlWorkflowTab,
  },
];

function GlPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const ActiveTabComponent = glTabs.find(tab => tab.id === activeTab)?.component || GlOverviewTab;

  return (
    <div>
      <div className='mx-auto space-y-6'>
        {/* Use GlHeader component */}
        <GlHeader />
        
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Total Assets</p>
                <p className="text-2xl font-bold">$500,000</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-2 text-sm text-indigo-100">+12.5% from last month</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Total Liabilities</p>
                <p className="text-2xl font-bold">$300,000</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-2 text-sm text-indigo-100">-5.2% from last month</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Open Journals</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-2 text-sm text-indigo-100">2 pending approval</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Current Period</p>
                <p className="text-2xl font-bold">Jan 2024</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-2 text-sm text-indigo-100">Open for posting</div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 p-2">
            <nav className="flex space-x-2">
              {glTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? `bg-indigo-50 border border-indigo-300 text-indigo-700 shadow-sm`
                        : 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${
                        isActive ? 'text-indigo-600' : 'text-indigo-400'
                      }`}
                    />
                    {tab.label}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 ml-1"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content Container */}
        <div>
          {/* Tab Content */}
            <ActiveTabComponent />
        </div>
      </div>
    </div>
  );
}

export default GlPage;