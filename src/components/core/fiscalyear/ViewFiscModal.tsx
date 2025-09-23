import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Calendar, Check, Clock, Eye } from 'lucide-react';
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
    return status === 'Yes' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  if (!fiscalYear) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
              onInteractOutside={(e) => e.preventDefault()}

      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <Eye size={20} />
            Fiscal Year Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Calendar className="text-emerald-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{fiscalYear.name}</h3>
                <p className="text-gray-600">
                  {formatDate(fiscalYear.dateStart)} - {formatDate(fiscalYear.dateEnd)}
                </p>
              </div>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fiscalYear.isActive)}`}>
                {fiscalYear.isActive === 'Yes' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Fiscal Year Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Calendar size={18} className="text-emerald-500" />
              Fiscal Year Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Gregorian Start Date</label>
                <p className="font-medium">{formatDate(fiscalYear.dateStart)}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Gregorian End Date</label>
                <p className="font-medium">{formatDate(fiscalYear.dateEnd)}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Ethiopian Start Date</label>
                <p className="font-medium">{fiscalYear.startDateAm || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Ethiopian End Date</label>
                <p className="font-medium">{fiscalYear.endDateAm || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Check size={18} className="text-blue-500" />
              System Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Created At</label>
                <p className="font-medium">{formatDate(fiscalYear.createdAt)}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Modified At</label>
                <p className="font-medium">{formatDate(fiscalYear.modifiedAt)}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Ethiopian Created At</label>
                <p className="font-medium">{fiscalYear.createdAtAm || 'N/A'}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Ethiopian Modified At</label>
                <p className="font-medium">{fiscalYear.modifiedAtAm || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Duration Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700">
              <Clock size={16} />
              <span className="text-sm font-medium">Duration: Approximately 365 days</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center border-t pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer px-8"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};