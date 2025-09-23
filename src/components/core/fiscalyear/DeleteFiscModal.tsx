import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertTriangle, Calendar } from 'lucide-react';
import type { FiscYearListDto, UUID } from '../../../types/core/fisc';

interface DeleteFiscModalProps {
  fiscalYear: FiscYearListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fiscalYearId: UUID) => void;
}

export const DeleteFiscModal: React.FC<DeleteFiscModalProps> = ({ 
  fiscalYear, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const handleConfirm = () => {
    if (fiscalYear) {
      onConfirm(fiscalYear.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]"
      onInteractOutside={(e) => e.preventDefault()} >
        <DialogHeader>
          <div className="flex items-center justify-center p-2 bg-red-100 rounded-full gap-2 text-red-600 mx-auto">
            <AlertTriangle size={24} />
          </div>
        </DialogHeader>
        {fiscalYear && (
          <div className="py-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <Calendar className="text-gray-600 mr-2" size={20} />
              <p className="font-medium text-lg">{fiscalYear.name}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(fiscalYear.dateStart).toLocaleDateString()} - {new Date(fiscalYear.dateEnd).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Status: <span className={fiscalYear.isActive === 'Yes' ? 'text-green-600' : 'text-gray-600'}>
                {fiscalYear.isActive === 'Yes' ? 'Active' : 'Inactive'}
              </span>
            </p>
            <p className="text-sm text-red-600 mt-4 font-medium">
              Are you sure you want to delete this fiscal year? This action cannot be undone.
            </p>
          </div>
        )}
        
        <DialogFooter className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="cursor-pointer px-6"
          >
            Delete Fiscal Year
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