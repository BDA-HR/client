import React from 'react';
import { motion } from 'framer-motion';
import { X, Eye, Calendar, Clock, Activity } from 'lucide-react';
import { Button } from '../../../components/ui/button';
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
    return status === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string): string => {
    return status === 'Yes' ? 'Active' : 'Inactive';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDurationInDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div className="flex items-center gap-2">
              <Eye size={20} />
            <div>
              <h2 className="text-lg font-bold text-gray-800">Details</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body - Side by Side Layout */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Main Info */}
            <div className="space-y-6">
              {/* Period Name & Status */}
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{period.name}</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border">
                  <div className={`w-2 h-2 rounded-full ${period.isActive === 'Yes' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className={`text-sm font-medium ${getStatusColor(period.isActive)}`}>
                    {getStatusText(period.isActive)}
                  </span>
                </div>
              </div>

              {/* Duration Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Duration</p>
                    <p className="text-xs text-blue-700">{getDurationInDays(period.dateStartStr, period.dateEndStr)} days</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-blue-900">Start / መጀመሪያ</p>
                    <p className="text-blue-700">{formatDate(period.dateStartStr)}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-blue-900">End / መጨረሻ</p>
                    <p className="text-blue-700">{formatDate(period.dateEndStr)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Timestamps */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <h4 className="text-sm font-medium text-gray-900 mb-3">Timestamps</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">Created At</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {period.createdAt ? formatDateTime(period.createdAt) : 'N/A'} /                       {period.createdAtAm ? formatDateTime(period.createdAtAm) : 'N/A'}

                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">Modified At</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {period.modifiedAt ? formatDateTime(period.modifiedAt) : 'N/A'} / 
                                            {period.modifiedAtAm ? formatDateTime(period.modifiedAtAm) : 'N/A'}

                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="space-y-4">
              {/* Status Details */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="text-purple-600" size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <p className="text-lg font-semibold text-gray-900">{getStatusText(period.isActive)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {period.isActive === 'Yes' 
                      ? 'This period is currently active' 
                      : 'This period is not active'
                    }
                  </p>
                </div>
              </motion.div>

              {/* Date Details */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 gap-3"
              >
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-green-600" size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Start Date / የመጀመሪያ ቀን</p>
                    <p className="text-sm text-green-700">{formatDate(period.dateStartStr) || 'N/A'} / {period.dateStartStrAm || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-orange-600" size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">End Date / የመጨረሻ ቀን</p>
                    <p className="text-sm text-orange-700">{formatDate(period.dateEndStr) || 'N/A'} / {period.dateEndStrAm  || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quarter</span>
                    <span className="text-sm font-medium text-gray-900">{period.quarter || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fiscal Year</span>
                    <span className="text-sm font-medium text-gray-900">{period.fiscYear || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="cursor-pointer px-8"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};