import { motion } from 'framer-motion';
import { X, Calendar, Check, Eye } from 'lucide-react';
import type { FiscYearListDto } from '../../../types/core/fisc';
import { Button } from '../../ui/button';

interface ViewFiscModalProps {
  fiscalYear: FiscYearListDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewFiscModal: React.FC<ViewFiscModalProps> = ({
  fiscalYear,
  isOpen,
  onClose,
}) => {
  const formatDate = (dateString: string): string => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A';
  };

  const getStatusColor = (status: string): string => {
    return status === 'Yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800';
  };

  if (!isOpen || !fiscalYear) return null;

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
            <h2 className="text-lg font-bold text-gray-800">Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Header Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Calendar className="text-emerald-600" size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold">{fiscalYear.name}</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(fiscalYear.dateStart)} - {formatDate(fiscalYear.dateEnd)}
                </p>
              </div>
              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fiscalYear.isActive)}`}>
                {fiscalYear.isActive === 'Yes' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Fiscal Year Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" />
              Fiscal Year Information
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Start Date Column */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="font-medium text-gray-900 text-sm">{formatDate(fiscalYear.dateStart)}</p>
                  <p className="font-medium text-gray-900 text-sm">{fiscalYear.startDateAm || 'N/A'}</p>
                </div>
              </div>
              
              {/* End Date Column */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="font-medium text-gray-900 text-sm">{formatDate(fiscalYear.dateEnd)}</p>
                  <p className="font-medium text-gray-900 text-sm">{fiscalYear.endDateAm || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base flex items-center gap-2">
              <Check size={16} className="text-blue-500" />
              System Information
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Created At Column */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created At</p>
                  <p className="font-medium text-gray-900 text-sm">{formatDate(fiscalYear.createdAt)}</p>
                  <p className="font-medium text-gray-900 text-sm">{fiscalYear.createdAtAm || 'N/A'}</p>
                </div>
              </div>
              
              {/* Modified At Column */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Modified At</p>
                  <p className="font-medium text-gray-900 text-sm">{formatDate(fiscalYear.modifiedAt)}</p>
                  <p className="font-medium text-gray-900 text-sm">{fiscalYear.modifiedAtAm || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer px-8 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};