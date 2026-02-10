import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { AlertTriangle } from 'lucide-react';
import type { PerApiListDto, UUID } from '../../../../types/core/Settings/api-permission';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface DeleteApiPermissionModalProps {
  permission: PerApiListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permissionId: UUID) => Promise<any>;
}

const DeleteApiPermissionModal: React.FC<DeleteApiPermissionModalProps> = ({
  permission,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!permission) return;

    setIsLoading(true);

    try {
      const response = await onConfirm(permission.id);
      const successMessage =
        response?.data?.message ||
        response?.message ||
        'API permission deleted successfully!';

      toast.success(successMessage);
      onClose();

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete API permission';
      toast.error(errorMessage);
      console.error('Error deleting API permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center p-3 bg-red-100 rounded-full gap-2 text-red-600 mx-auto">
            <AlertTriangle size={32} />
          </div>
        </DialogHeader>
        {permission && (
          <div className="py-4 text-center space-y-4">
            {/* <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Key className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{permission.name}</p>
                <p className="text-sm text-gray-500">{permission.key}</p>
              </div>
            </div> */}

            <p className="text-lg font-medium text-red-600">
              Are you sure you want to delete this API permission?
            </p>
          </div>
        )}

        <DialogFooter className="border-t pt-6">
          <div className='mx-auto flex justify-center items-center gap-1.5'>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="cursor-pointer px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete!'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer px-6" disabled={isLoading}>
                No, Keep It.
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteApiPermissionModal;