import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertTriangle, Building } from 'lucide-react';
import type { BranchListDto, UUID } from '../../../types/core/branch';

interface DeleteBranchModalProps {
  branch: BranchListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (branchId: UUID) => void;
}

const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ 
  branch, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const handleConfirm = () => {
    if (branch) {
      onConfirm(branch.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center p-2 bg-red-100 rounded-full gap-2 text-red-600 mx-auto">
            <AlertTriangle size={24} />
          </div>
        </DialogHeader>
        {branch && (
          <div className="py-4 text-center">
            <div className="flex items-center justify-center mb-3">
              <Building className="text-gray-600 mr-2" size={20} />
              <p className="font-medium text-lg">{branch.name}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">{branch.nameAm}</p>
            <p className="text-sm text-gray-500">Code: {branch.code} • {branch.location}</p>
            <p className="text-sm text-red-600 mt-4 font-medium">
              Are you sure you want to delete this branch? This action cannot be undone.
            </p>
          </div>
        )}
        
        <DialogFooter className="border-t pt-6">
          <div className="flex justify-center items-center gap-3">
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

export default DeleteBranchModal;