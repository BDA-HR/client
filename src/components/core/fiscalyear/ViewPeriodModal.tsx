import React from 'react';
import { motion } from 'framer-motion';
import { X, Eye } from 'lucide-react';
import type { PeriodListDto } from '../../../types/core/period';

interface ViewPeriodModalProps {
  period: PeriodListDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewPeriodModal: React.FC<ViewPeriodModalProps> = ({ 
  period, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !period) return null;

  const getStatusColor = (status: string): string => {
    return status === 'true' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string): string => {
    return status === 'true' ? 'Active' : 'Inactive';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Eye size={20} />
            <h2 className="text-lg font-bold text-gray-800">Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body - Two Column Layout */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Period Name */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Period Name</p>
                <p className="font-medium text-gray-900">{period.name}</p>
              </div>

              {/* Quarter */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Quarter</p>
                <p className="font-medium text-gray-900">{period.quarter}</p>
              </div>

              {/* Fiscal Year */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Fiscal Year</p>
                <p className="font-medium text-gray-900">{period.fiscYear}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* Status */}
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    period.isActive
                  )}`}
                >
                  {getStatusText(period.isActive)}
                </span>
              </div>

              {/* Start Date */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Start Date</p>
                <div>
                  <p className="font-medium text-gray-900">{period.dateStartStr}</p>
                  <p className="font-medium text-gray-900">{period.dateStartStrAm}</p>
                </div>
              </div>

              {/* End Date */}
              <div>
                <p className="text-sm text-gray-500 mb-2">End Date</p>
                <div>
                  <p className="font-medium text-gray-900">{period.dateEndStr}</p>
                  <p className="font-medium text-gray-900">{period.dateEndStrAm}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="border-t px-6 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Created At: <span className="font-medium">{period.createdAt} / {period.createdAtAm}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Modified At: <span className="font-medium">{period.modifiedAt} / {period.modifiedAtAm}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="border-t p-2 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};