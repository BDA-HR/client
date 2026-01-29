import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "../../../../ui/button";

interface AssignPolicyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AssignPolicyConfirmationModal: React.FC<
  AssignPolicyConfirmationModalProps
> = ({  isOpen, onClose, onConfirm }) => {
  if (!isOpen ) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-lg"
      >
        {/* Modal Body */}
        <div className="p-2 sm:p-4">
          <div className="py-2 sm:py-4 text-center">
            <div className="flex items-center justify-center p-2 sm:p-3 rounded-full gap-2 text-green-600 mx-auto">
              <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>

            <p className="text-base sm:text-lg font-medium text-gray-800 mt-3 sm:mt-4">
              Are you sure you want to assign this leave policy?
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t p-4 sm:px-6 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-1.5">
            <Button
              onClick={handleConfirm}
              className="flex cursor-pointer items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto"
            >
              Confirm
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignPolicyConfirmationModal;