import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { BenefitSetListDto } from "../../../../types/hr/benefit";
import { Button } from "../../../ui/button";

interface DeleteBenefitModalProps {
  benefitSet: BenefitSetListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (benefitSet: BenefitSetListDto) => void;
}

const DeleteBenefitModal: React.FC<DeleteBenefitModalProps> = ({
  benefitSet,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !benefitSet) return null;

  const handleConfirm = () => {
    onConfirm(benefitSet);
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
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
              Are you sure you want to delete this benefit set?
            </p>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
            

          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="cursor-pointer px-6"
            >
              Delete
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteBenefitModal;