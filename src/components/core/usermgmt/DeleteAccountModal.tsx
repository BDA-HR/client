import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { EmpSearchRes } from "../../../types/core/EmpSearchRes";
import { Button } from "../../ui/button";

interface DeleteAccountModalProps {
  employee: EmpSearchRes | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  isDeleting?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  employee,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !employee) return null;

  const handleConfirm = () => {
    onConfirm(employee.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-1/3 max-h-[90vh] overflow-y-auto"
      >
        {/* modal body */}
        <div className="p-6">
          <div className="py-4 text-center">
            <div className="flex items-center justify-center p-3 rounded-full gap-2 text-red-600 mx-auto">
              <AlertTriangle size={50} />
            </div>

            <p className="text-lg font-medium text-red-600 mt-4">
              Are you sure you want to delete this account?
            </p>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>

            <p className="text-sm text-gray-700 mt-3">
              This will remove all access permissions and login capabilities for
              this user.
            </p>
          </div>
        </div>

        {/* modal footer  */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="cursor-pointer px-6"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete!"
              )}
            </Button>
            <Button
              onClick={onClose}
              disabled={isDeleting}
              variant="outline"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              No, Keep It.
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteAccountModal;
