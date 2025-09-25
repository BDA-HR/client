import { motion } from 'framer-motion';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import type { FiscYearListDto } from '../../../types/core/fisc';

interface ActiveFiscProps {
  activeYear: FiscYearListDto | null;
  loading: boolean;
  error: string | null;
  onViewDetails: (year: FiscYearListDto) => void;
}

export default function ActiveFisc({ activeYear, loading }: ActiveFiscProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!activeYear) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-50 to-red-100 border-l-4 border-yellow-500 rounded-lg shadow-sm p-6 mb-6"
      >
        <div className="flex items-center">
          <XCircleIcon className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <h3 className="text-yellow-800 font-medium">No Active Fiscal Year</h3>
            <p className="text-yellow-700 text-sm mt-1">
              There is currently no active fiscal year. Please set a fiscal year as active to continue.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg shadow-sm p-6 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CalendarIcon className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{activeYear.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <CheckCircleIcon className="h-3 w-3 mr-1" />
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(activeYear.dateStart)} - {formatDate(activeYear.dateEnd)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">Current</div>
          <div className="text-xs text-gray-500 mt-1">Fiscal Year</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-emerald-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Start Date:</span>
            <span className="ml-2 font-medium text-gray-900">{formatDate(activeYear.dateStart)}</span>
          </div>
          <div>
            <span className="text-gray-500">End Date:</span>
            <span className="ml-2 font-medium text-gray-900">{formatDate(activeYear.dateEnd)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}