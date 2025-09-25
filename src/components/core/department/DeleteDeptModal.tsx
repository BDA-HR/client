import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertTriangle } from 'lucide-react';
import type { DeptListDto, UUID } from '../../../types/core/dept';

interface DeleteDeptModalProps {
  department: DeptListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (departmentId: UUID) => void;
}

const DeleteDeptModal: React.FC<DeleteDeptModalProps> = ({ 
  department, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const handleConfirm = () => {
    if (department) {
      onConfirm(department.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center p-3 bg-red-100 rounded-full gap-2 text-red-600 mx-auto">
            <AlertTriangle size={32} />
          </div>
        </DialogHeader>
        {department && (
          <div className="py-4 text-center">
            <p className="text-lg font-medium text-red-600 mt-4">
              Are you sure you want to delete this department?
            </p>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
            {department.deptStat === 'Active' && (
              <p className="text-sm text-amber-600 mt-2">
                Note: This department is currently active. Deleting it may affect associated employees.
              </p>
            )}
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

export default DeleteDeptModal;