import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertTriangle } from 'lucide-react';
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
            <AlertTriangle size={32} />
          </div>
        </DialogHeader>
        {period && (
          <div className="py-4 text-center">
            <p className="text-lg font-medium text-red-600 mt-0.5">
              Are you sure you want to delete the period "{period.name}"?
            </p>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        )}
        
        <DialogFooter className="border-t pt-6">
            <div className='mx-auto flex justify-center items-center gap-1.5'>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="cursor-pointer px-6"
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer px-6">
              Cancel
            </Button>
          </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};