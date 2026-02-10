import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { DeptListDto, UUID } from '../../../types/core/dept';
import toast from 'react-hot-toast';

interface DeleteDeptModalProps {
  department: DeptListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (departmentId: UUID) => Promise<any>;
}

const DeleteDeptModal: React.FC<DeleteDeptModalProps> = ({ 
  department, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!department) return;

    setIsLoading(true);

    try {
      const response = await onConfirm(department.id);
        const successMessage = 
        response?.data?.message || 
        response?.message || 
        '';
      
      toast.success(successMessage);
      
      onClose();
      
    } catch (error: any) {
      const errorMessage = error.message || '';
      toast.error(errorMessage);
      console.error('Error deleting department:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-1/3 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Body */}
        <div className="p-6">
          <div className="py-4 text-center">
            <div className="flex items-center justify-center p-3 rounded-full gap-2 text-red-600 mx-auto">
              <AlertTriangle size={50} />
            </div>

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
        </div>

        {/* Modal Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="cursor-pointer px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete!'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
              disabled={isLoading}
            >
              No, Keep It.
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteDeptModal;