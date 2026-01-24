import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, BadgePlus } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import toast from "react-hot-toast";
import type {
  LeaveAppChainAddDto,
  UUID,
} from "../../../../../types/core/Settings/leaveAppChain";

interface AddLeaveAppChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  leavePolicyId: UUID; // Added: receive leavePolicyId as prop
  onAddLeaveAppChain: (appChain: LeaveAppChainAddDto) => Promise<void>;
}

const AddLeaveAppChainModal: React.FC<AddLeaveAppChainModalProps> = ({
  isOpen,
  onClose,
  leavePolicyId,
  onAddLeaveAppChain,
}) => {
  const [formData, setFormData] = useState<
    Omit<LeaveAppChainAddDto, "leavePolicyId">
  >({
    effectiveFrom: new Date(), // Changed from null to empty string
    effectiveTo: null,
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      effectiveFrom: new Date(),
      effectiveTo: null,
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.effectiveFrom)
      errors.effectiveFrom = "Effective From is required";
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    setLoading(true);
    try {
        const completeData: LeaveAppChainAddDto = {
          leavePolicyId: leavePolicyId,
          effectiveFrom: formData.effectiveFrom,
          effectiveTo: formData.effectiveTo, 
        };

      await onAddLeaveAppChain(completeData);
      toast.success("Leave AppChain added successfully");
      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add leave AppChain");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <BadgePlus size={20} className="text-green-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Add Leave AppChain
              </h2>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-3 space-y-2">
            {/* Effective From */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 font-medium">
                Effective From <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                name="effectiveFrom"
                value={new Date(formData.effectiveFrom).toISOString().split("T")[0]}
                onChange={handleChange}
                className={`w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  formErrors.effectiveFrom ? "border-red-500" : ""
                }`}
                disabled={loading}
              />
              {formErrors.effectiveFrom && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.effectiveFrom}
                </p>
              )}
            </div>

            {/* Effective To */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 font-medium">
                Effective To
              </Label>
              <Input
                type="date"
                name="effectiveTo"
                value={formData.effectiveTo ? new Date(formData.effectiveTo).toISOString().split("T")[0] : ""}
                onChange={handleChange}
                className={`w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  formErrors.effectiveTo ? "border-red-500" : ""
                }`}
                disabled={loading}
              />
              {formErrors.effectiveTo && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.effectiveTo}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-2 bg-gray-50">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="px-6 min-w-25"
                onClick={handleCancel}
                disabled={loading}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="flex cursor-pointer items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white whitespace-nowrap w-full sm:w-auto"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save AppChain"}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLeaveAppChainModal;
