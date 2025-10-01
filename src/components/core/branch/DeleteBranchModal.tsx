import React from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import type { BranchListDto, UUID } from '../../../types/core/branch';
import { Button } from "../../ui/button";

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
  if (!isOpen || !branch) return null;

  const handleConfirm = () => {
    onConfirm(branch.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
<div className="py-4 text-center">
              <div className="flex items-center justify-center p-3 bg-red-100 rounded-full gap-2 text-red-600 mx-auto">
            <AlertTriangle size={32} />
          </div>

            <p className="text-lg font-medium text-red-600 mt-4">
              Are you sure you want to delete this branch?
            </p>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-3 mb-0">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              variant="destructive" 
              onClick={handleConfirm}
              className="cursor-pointer px-6">
              Delete
            </Button>
<button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteBranchModal;