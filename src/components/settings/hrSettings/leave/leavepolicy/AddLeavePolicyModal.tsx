import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, BadgePlus } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../ui/dropdown-menu";
import toast from "react-hot-toast";
import type {
  LeavePolicyAddDto,
  LeaveTypeOptionDto,
  UUID,
} from "../../../../../types/core/Settings/leavepolicy";
import type { LeaveTypeListDto } from "../../../../../types/core/Settings/leavetype";

interface AddLeavePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeavePolicy: (policy: LeavePolicyAddDto) => Promise<void>;
  leaveTypeOptions:  LeaveTypeOptionDto[]; 
}

const AddLeavePolicyModal: React.FC<AddLeavePolicyModalProps> = ({
  isOpen,
  onClose,
  onAddLeavePolicy,
  leaveTypeOptions
}) => {
  const [formData, setFormData] = useState<LeavePolicyAddDto>({
    code: "",
    name: "",
    allowEncashment: true,
    requiresAttachment: true,
    status: "Active",
    leaveTypeId: "" as UUID,
  });
 
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [isLeaveTypeDropdownOpen, setIsLeaveTypeDropdownOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] =
    useState<LeaveTypeOptionDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
    }
  }, [isOpen]);

 

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      allowEncashment: true,
      requiresAttachment: true,
      status: "Active",
      leaveTypeId: "" as UUID,
    });
    setSelectedLeaveType(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = "Code is required";
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.leaveTypeId) errors.leaveTypeId = "Leave type is required";
    setFormErrors(errors);
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

  const handleLeaveTypeSelect = (leaveType: LeaveTypeOptionDto) => {
    setSelectedLeaveType(leaveType);
    setFormData((prev) => ({ ...prev, leaveTypeId: leaveType.id }));
    setIsLeaveTypeDropdownOpen(false);

    if (formErrors.leaveTypeId)
      setFormErrors((prev) => ({ ...prev, leaveTypeId: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    setLoading(true);
    try {
      await onAddLeavePolicy(formData);
      toast.success("Leave policy added successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add leave policy");
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} />
            <h2 className="text-lg font-bold text-gray-800">
              Add Leave Policy
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {/* Code */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 font-medium">
                Code <span className="text-red-500">*</span>
              </Label>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Eg. POL24"
                className={`w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formErrors.code ? "border-red-500" : ""
                }`}
                disabled={loading}
              />
              {formErrors.code && (
                <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 font-medium">
                Policy Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Eg. Annual Leave Policy 2024"
                className={`w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formErrors.name ? "border-red-500" : ""
                }`}
                disabled={loading}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Leave Type */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 font-medium">
                Leave Type <span className="text-red-500">*</span>
              </Label>
              <DropdownMenu
                open={isLeaveTypeDropdownOpen}
                onOpenChange={setIsLeaveTypeDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between ${
                      formErrors.leaveTypeId
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${
                      loadingLeaveTypes ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {selectedLeaveType?.name ||
                      (loadingLeaveTypes ? "Loading..." : "Select leave type")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                  {leaveTypeOptions.map((lt) => (
                    <DropdownMenuItem
                      key={lt.id}
                      onClick={() => handleLeaveTypeSelect(lt)}
                      className="text-sm cursor-pointer"
                    >
                      {lt.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {formErrors.leaveTypeId && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.leaveTypeId}
                </p>
              )}
            </div>

            {/* Boolean checkboxes */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allowEncashment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowEncashment: e.target.checked,
                    })
                  }
                />
                <span className="text-sm text-gray-700">Allow Encashment</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.requiresAttachment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiresAttachment: e.target.checked,
                    })
                  }
                />
                <span className="text-sm text-gray-700">
                  Requires Attachment
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100 px-6"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              type="submit"
              disabled={
                loading || !formData.name.trim() || !formData.leaveTypeId
              }
            >
              {loading ? "Saving..." : "Save Policy"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLeavePolicyModal;
