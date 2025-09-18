import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertTriangle } from 'lucide-react';
import type { CompListDto, UUID } from '../../../types/core/comp';

interface DeleteCompModalProps {
  company: CompListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (companyId: UUID) => void;
}

const DeleteCompModal: React.FC<DeleteCompModalProps> = ({ 
  company, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const handleConfirm = () => {
    if (company) {
      onConfirm(company.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={24} />
            <DialogTitle>Delete Company</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete this company? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {company && (
          <div className="py-4">
            <p className="font-medium">{company.nameAm}</p>
            <p className="text-sm text-gray-600">{company.name}</p>
            {parseInt(company.branchCount) > 0 && (
              <p className="text-sm text-red-600 mt-2">
                Warning: This company has {company.branchCount} branch(es). 
                Deleting it will also remove all associated branches.
              </p>
            )}
          </div>
        )}
        
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="cursor-pointer"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCompModal;