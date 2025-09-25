import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertTriangle, Calendar } from 'lucide-react';
import type { PeriodListDto, UUID } from '../../../types/core/period';

interface DeletePeriodModalProps {
  period: PeriodListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (periodId: UUID) => void;
}

export const DeletePeriodModal: React.FC<DeletePeriodModalProps> = ({ 
  period, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const handleConfirm = () => {
    if (period) {
      onConfirm(period.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center p-2 bg-red-100 rounded-full gap-2 text-red-600 mx-auto">
            <AlertTriangle size={24} />
          </div>
        </DialogHeader>
        {period && (
          <div className="py-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <Calendar className="text-gray-600 mr-2" size={20} />
              <p className="font-medium text-lg">{period.name}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {period.quarter} • {period.fiscYear}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(period.dateStart).toLocaleDateString()} - {new Date(period.dateEnd).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Status: <span className={period.isActive === 'Yes' ? 'text-green-600' : 'text-gray-600'}>
                {period.isActive === 'Yes' ? 'Active' : 'Inactive'}
              </span>
            </p>
            <p className="text-sm text-red-600 mt-4 font-medium">
              Are you sure you want to delete this period? This action cannot be undone.
            </p>
          </div>
        )}
        
        <DialogFooter className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="cursor-pointer px-6"
          >
            Delete Period
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer px-6">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};