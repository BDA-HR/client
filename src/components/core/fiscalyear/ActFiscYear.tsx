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
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!activeYear) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-50 to-red-100 border-l-4 border-yellow-500 rounded-lg shadow-sm p-4 mb-4"
      >
        <div className="flex items-center">
          <XCircleIcon className="h-4 w-4 text-yellow-400 mr-2" />
          <div>
            <h3 className="text-yellow-800 font-medium text-sm">No Active Fiscal Year</h3>
            <p className="text-yellow-700 text-xs mt-1">
              Please set a fiscal year as active to continue.
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
      className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg shadow-sm p-4 mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-2 rounded-full">
            <CalendarIcon className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-gray-900">{activeYear.name}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <CheckCircleIcon className="h-2.5 w-2.5 mr-1" />
                Active
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {activeYear.startDate} - {activeYear.endDate}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-emerald-600">Current</div>
          <div className="text-xs text-gray-500">Fiscal Year</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-emerald-100">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-500">Start Date:</span>
            <div className="font-medium text-gray-900">
              <div>{activeYear.startDate} / {activeYear.startDateAm}</div>
              <div className="text-gray-500 text-xs">ISO: {new Date(activeYear.dateStart).toLocaleDateString()}</div>
            </div>
          </div>
          <div>
            <span className="text-gray-500">End Date:</span>
            <div className="font-medium text-gray-900">
              <div>{activeYear.endDate} / {activeYear.endDateAm}</div>
              <div className="text-gray-500 text-xs">ISO: {new Date(activeYear.dateEnd).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}