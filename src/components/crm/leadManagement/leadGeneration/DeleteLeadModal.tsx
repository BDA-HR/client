import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { Lead } from "../../../../types/crm";
import { Button } from "../../../ui/button";

interface DeleteLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lead: Lead) => void;
}

const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !lead) return null;

  const handleConfirm = () => {
    onConfirm(lead);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50  h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-xl w-1/3 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Body */}
        <div className="space-y-2">
          <div className="pt-4 pb-2 text-center">
            <div className="flex items-center justify-center rounded-full gap-2 text-red-600 mx-auto">
              <AlertTriangle size={50} />
            </div>

            <p className="text-lg font-medium text-red-600 mt-4">
             Delete Lead
            </p>
            <p className="text-sm text-red-600 mt-2">
              You are going to delete the lead.
            </p>

          </div>
        </div>

        {/* Modal Footer */}
        <div className=" px-6 py-4">
          <div className="mx-auto flex justify-center items-center gap-3">
             <Button
              onClick={onClose}
              variant="outline"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200 font-medium"
            >
            No, Keep it.
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="cursor-pointer px-6"
            >
             Yes, Delete!
            </Button>
           
         </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteLeadModal;