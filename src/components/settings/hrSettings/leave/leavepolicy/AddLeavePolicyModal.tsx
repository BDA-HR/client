import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, BadgePlus } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../ui/dropdown-menu';
import type { LeavePolicyAddDto, UUID } from '../../../../../types/core/Settings/leavepolicy';
import type { LeaveTypeListDto } from '../../../../../types/core/Settings/leavetype';
import { leaveTypeService } from '../../../../../services/core/settings/ModHrm/LeaveTypeService';
import toast from 'react-hot-toast';
interface AddLeavePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeavePolicy: (policy: LeavePolicyAddDto) => Promise<void>;
}

const AddLeavePolicyModal: React.FC<AddLeavePolicyModalProps> = ({
  isOpen,
  onClose,
  onAddLeavePolicy,
}) => {
  const [formData, setFormData] = useState<LeavePolicyAddDto>({
    name: '',
    requiresAttachment: false,
    minDurPerReq: 1,
    maxDurPerReq: 30,
    holidaysAsLeave: false,
    leaveTypeId: '' as UUID
  });
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<LeaveTypeListDto[]>([]);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [isLeaveTypeDropdownOpen, setIsLeaveTypeDropdownOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeListDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchLeaveTypes();
      setFormErrors({});
    }
  }, [isOpen]);

  const fetchLeaveTypes = async () => {
    try {
      setLoadingLeaveTypes(true);
      const leaveTypesData = await leaveTypeService.getAllLeaveTypes();
      setLeaveTypeOptions(leaveTypesData);
    } catch (error) {
      console.error("Error fetching leave types:", error);
      toast.error("Failed to load leave types");
      setLeaveTypeOptions([]);
    } finally {
      setLoadingLeaveTypes(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      requiresAttachment: false,
      minDurPerReq: 1,
      maxDurPerReq: 30,
      holidaysAsLeave: false,
      leaveTypeId: '' as UUID
    });
    setSelectedLeaveType(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = "Policy name is required";
    }

    if (!formData.leaveTypeId) {
      errors.leaveTypeId = "Leave type is required";
    }

    if (formData.minDurPerReq <= 0) {
      errors.minDurPerReq = "Minimum duration must be greater than 0";
    }

    if (formData.maxDurPerReq <= 0) {
      errors.maxDurPerReq = "Maximum duration must be greater than 0";
    }

    if (formData.maxDurPerReq < formData.minDurPerReq) {
      errors.maxDurPerReq = "Maximum duration must be greater than or equal to minimum duration";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked :
      type === 'number' ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLeaveTypeSelect = (leaveType: LeaveTypeListDto) => {
    setSelectedLeaveType(leaveType);
    setFormData(prev => ({
      ...prev,
      leaveTypeId: leaveType.id
    }));
    setIsLeaveTypeDropdownOpen(false);

    // Clear error for this field
    if (formErrors.leaveTypeId) {
      setFormErrors((prev) => ({ ...prev, leaveTypeId: "" }));
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
      await onAddLeavePolicy(formData);
      toast.success("Leave policy added successfully");
      onClose();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add leave policy';
      toast.error(errorMessage);
      console.error("Error adding leave policy:", error);
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
            <h2 className="text-lg font-bold text-gray-800">Add Leave Policy</h2>
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
          <div className="px-6">
            <div className="py-4 space-y-4">
              {/* Policy Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                  Policy Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Eg. Annual Leave Policy 2024"
                  className={`w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.name ? "border-red-500" : ""
                    }`}
                  required
                  disabled={loading}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Leave Type Selection */}
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
                      className={`w-full justify-between focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.leaveTypeId ? "border-red-500" : "border-gray-300"
                        } ${loadingLeaveTypes ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <span className="text-sm">
                        {selectedLeaveType
                          ? selectedLeaveType.name
                          : loadingLeaveTypes
                            ? "Loading leave types..."
                            : "Select a leave type"
                        }
                      </span>
                      <svg
                        className={`h-4 w-4 opacity-50 transition-transform ${isLeaveTypeDropdownOpen ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto"
                  >
                    {leaveTypeOptions.map((leaveType) => (
                      <DropdownMenuItem
                        key={leaveType.id}
                        onClick={() => handleLeaveTypeSelect(leaveType)}
                        className="cursor-pointer text-sm"
                      >
                        {leaveType.name}
                      </DropdownMenuItem>
                    ))}
                    {leaveTypeOptions.length === 0 && !loadingLeaveTypes && (
                      <DropdownMenuItem className="text-sm text-gray-500" disabled>
                        No leave types available
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {loadingLeaveTypes && (
                  <p className="text-sm text-gray-500 mt-1">Loading leave types...</p>
                )}
                {formErrors.leaveTypeId && !loadingLeaveTypes && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.leaveTypeId}</p>
                )}
              </div>

              {/* Duration Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDurPerReq" className="text-sm text-gray-700 font-medium">
                    Minimum Duration (Days) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="minDurPerReq"
                      name="minDurPerReq"
                      type="number"
                      value={formData.minDurPerReq}
                      onChange={handleChange}
                      placeholder="1"
                      min="0.5"
                      step="0.5"
                      className={`w-full pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.minDurPerReq ? "border-red-500" : ""
                        }`}
                      required
                      disabled={loading}
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.minDurPerReq && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.minDurPerReq}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDurPerReq" className="text-sm text-gray-700 font-medium">
                    Maximum Duration (Days) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="maxDurPerReq"
                      name="maxDurPerReq"
                      type="number"
                      value={formData.maxDurPerReq}
                      onChange={handleChange}
                      placeholder="30"
                      min={formData.minDurPerReq}
                      step="0.5"
                      className={`w-full pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${formErrors.maxDurPerReq ? "border-red-500" : ""
                        }`}
                      required
                      disabled={loading}
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {formErrors.maxDurPerReq && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.maxDurPerReq}</p>
                  )}
                </div>
              </div>

              {/* Boolean Settings */}
              <div className="grid grid-cols-2 gap-4">
                {/* Requires Attachment */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 font-medium">
                    Requires Attachment
                  </Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="requiresAttachment"
                        checked={formData.requiresAttachment === true}
                        onChange={() => setFormData(prev => ({ ...prev, requiresAttachment: true }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="requiresAttachment"
                        checked={formData.requiresAttachment === false}
                        onChange={() => setFormData(prev => ({ ...prev, requiresAttachment: false }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Holidays as Leave */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 font-medium">
                    Holidays Count as Leave
                  </Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="holidaysAsLeave"
                        checked={formData.holidaysAsLeave === true}
                        onChange={() => setFormData(prev => ({ ...prev, holidaysAsLeave: true }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="holidaysAsLeave"
                        checked={formData.holidaysAsLeave === false}
                        onChange={() => setFormData(prev => ({ ...prev, holidaysAsLeave: false }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 rounded-b-xl">
            <div className="flex flex-row-reverse justify-center items-center gap-3">
              <Button
                variant="outline"
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-100"
                onClick={handleCancel}
                type="button"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                type="submit"
                disabled={loading || loadingLeaveTypes || !formData.name.trim() || !formData.leaveTypeId}
              >
                {loading ? "Saving..." : "Save Policy"}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLeavePolicyModal;