import { useState } from "react";
import { motion } from "framer-motion";
import { X, PenBox } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface EditModalProps {
  onEdit: () => void;
  title?: string;
}

const EditModal: React.FC<EditModalProps> = ({ 
  onEdit, 
  title = "Edit" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger from DropdownMenuItem */}
      <div onClick={() => setIsOpen(true)} className="w-full">
        <div className="flex items-center gap-2 cursor-pointer">
          <PenBox size={16} />
          Edit
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <PenBox size={20} />
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-2">
              <div className="mx-auto flex justify-center items-center gap-1.5">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer px-6"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default EditModal;