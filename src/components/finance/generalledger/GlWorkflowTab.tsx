import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Zap,
  FileText,
  Database,
  Settings,
  Lock,
  FileCheck,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '../../ui/badge';

export const GlWorkflowTab: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState({
    workflow: false,
  });

  // Workflow steps
  const workflowSteps = [
    {
      step: 1,
      title: 'Transaction Initiation',
      description: 'Transactions originate from various integrated ERP modules (AP, AR, Inventory, Payroll, Fixed Assets)',
      icon: <Zap className="w-5 h-5" />
    },
    {
      step: 2,
      title: 'Journal Entry Creation',
      description: 'Convert transactions into debit/credit entries with double-entry validation',
      icon: <FileText className="w-5 h-5" />
    },
    {
      step: 3,
      title: 'Posting to GL Accounts',
      description: 'Post validated entries to appropriate GL accounts with real-time balance updates',
      icon: <Database className="w-5 h-5" />
    },
    {
      step: 4,
      title: 'Period-End Adjustments',
      description: 'Perform accruals, deferrals, reclassifications, and currency revaluation',
      icon: <Settings className="w-5 h-5" />
    },
    {
      step: 5,
      title: 'Period/Year-End Closing',
      description: 'Close accounting periods and perform year-end procedures',
      icon: <Lock className="w-5 h-5" />
    },
    {
      step: 6,
      title: 'Reconciliation and Audit',
      description: 'Reconcile GL balances with subledgers and review audit trails',
      icon: <FileCheck className="w-5 h-5" />
    },
    {
      step: 7,
      title: 'Financial Reporting',
      description: 'Generate trial balance, P&L, balance sheet, and custom reports',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      step: 8,
      title: 'Monitoring and Analysis',
      description: 'Monitor financial performance with dashboards and alerts',
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <motion.div
      key="workflow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-indigo-200 overflow-hidden">
        <button
          onClick={() => toggleSection('workflow')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-indigo-50 transition-colors"
        >
          <h2 className="text-xl font-bold flex items-center space-x-2 text-indigo-900">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <span>Typical GL Workflow</span><Badge className="bg-indigo-100 text-indigo-800">TODO</Badge>
          </h2>
          {expandedSections.workflow ? (
            <ChevronDown className="w-5 h-5 text-indigo-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-indigo-600" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.workflow && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6"
            >
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 to-indigo-100"></div>
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start mb-8"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg">
                      {step.step}
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-xl border border-indigo-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                            <div className="text-white">{step.icon}</div>
                          </div>
                          <h3 className="text-lg font-bold text-indigo-900">{step.title}</h3>
                        </div>
                        <p className="text-indigo-700">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};