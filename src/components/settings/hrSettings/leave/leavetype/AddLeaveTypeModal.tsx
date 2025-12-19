import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus, Calendar } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import type { LeaveTypeAddDto } from '../../../../../types/hr/leavetype';
import toast from 'react-hot-toast';

interface AddLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeaveType: (leaveType: LeaveTypeAddDto) => Promise<any>;
}

const AddLeaveTypeModal: React.FC<AddLeaveTypeModalProps> = ({
  isOpen,
  onClose,
  onAddLeaveType,
}) => {
  const [formData, setFormData] = useState<LeaveTypeAddDto>({
    name: '',
    isPaid: true, // Default to paid leave
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a leave type name");
      return;
    }

    setIsLoading(true);

    try {
      const response = await onAddLeaveType({
        name: formData.name.trim(),
        isPaid: formData.isPaid,
      });

      const successMessage =
        response?.data?.message ||
        response?.message ||
        "Leave type added successfully";

      toast.success(successMessage);

      // Reset after save
      setFormData({ name: '', isPaid: true });
      onClose();

    } catch (error: any) {
      const errorMessage = error?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Error adding leave type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // reset form when closing
    setFormData({ name: '', isPaid: true });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} />
            <h2 className="text-lg font-bold text-gray-800">Add New Leave Type</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Leave Type Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                Leave Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Eg. Annual Leave, Sick Leave"
                className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>

            {/* Payment Status (Card Style) */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 font-medium">
                Payment Status <span className="text-red-500">*</span>
              </Label>

              <div className="grid grid-cols-2 gap-3">
                {/* Paid */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isPaid: true }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                    formData.isPaid
                      ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  disabled={isLoading}
                >
                  <div
                    className={`p-2 rounded-full ${
                      formData.isPaid
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm">Paid Leave</span>
                  <span className="text-xs opacity-75">Employee receives pay</span>
                </button>

                {/* Unpaid */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isPaid: false }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                    !formData.isPaid
                      ? "border-red-400 bg-red-50 text-red-400 shadow-sm"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  disabled={isLoading}
                >
                  <div
                    className={`p-2 rounded-full ${
                      !formData.isPaid
                        ? "bg-red-100 text-red-400"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm">Unpaid Leave</span>
                  <span className="text-xs opacity-75">No payment during leave</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex justify-center items-center gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6 shadow-sm"
              onClick={handleSubmit}
              disabled={!formData.name.trim() || isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddLeaveTypeModal;