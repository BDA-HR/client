import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, BadgePlus } from "lucide-react";
import { Button } from "../../../../../ui/button";
import { Label } from "../../../../../ui/label";
import { Input } from "../../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../ui/select";
import toast from "react-hot-toast";
import type {
  LeaveAppStepAddDto,
  UUID,
} from "../../../../../../types/core/Settings/leaveAppStep";
import { ApprovalRole } from "../../../../../../types/core/enum";
import type { NameListDto } from "../../../../../../types/hr/NameListDto";

interface AddLeaveAppStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeaveAppStep: (leaveAppStep: LeaveAppStepAddDto) => Promise<any>;
  leavePolicyId: UUID;
  employees: NameListDto[];
}

const AddLeaveAppStepModal: React.FC<AddLeaveAppStepModalProps> = ({
  isOpen,
  onClose,
  onAddLeaveAppStep,
  leavePolicyId,
  employees,
}) => {
  const [stepName, setStepName] = useState("");
  const [stepOrder, setStepOrder] = useState<number>(1);
  const [role, setRole] = useState<string>("0"); // Default to "0" (Manager)
  const [isFinal, setIsFinal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>("");

  // Create options from enum entries
  const roleOptions = Object.entries(ApprovalRole).map(([key, value]) => ({
    key,
    value,
  }));

  const employeeOptions = employees.map((employee) => ({
    value: employee.id,
    label: employee.name,
  }));

  const resetForm = () => {
    setStepName("");
    setStepOrder(1);
    setRole("0");
    setEmployeeId("");
    setIsFinal(false);
  };

  const handleSubmit = async () => {
    if (!stepName.trim()) {
      toast.error("Step name is required");
      return;
    }

    if (!role || role.trim() === "") {
      toast.error("Role is required");
      return;
    }

    setIsLoading(true);
    try {
      const payload: LeaveAppStepAddDto = {
        stepName: stepName.trim(),
        stepOrder,
        role: role,
        employeeId: employeeId || null,
        isFinal,
        leavePolicyId,
      };

      console.log("Sending payload:", payload);
      await onAddLeaveAppStep(payload);
      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create approval step");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  }, [isLoading, onClose]);

  // Escape key support
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, handleClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const selectedEmployee = employees.find((emp) => emp.id === employeeId);
  const selectedEmployeeName = selectedEmployee?.name || "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-2">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} className="text-green-400" />
            <h2 className="text-lg font-semibold">Add Approval Step</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Body */}
          <div className="px-6 py-3 space-y-3">
            {/* Step Name and Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label
                  htmlFor="stepName"
                  className="text-sm text-gray-700 font-medium"
                >
                  Step Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    value={stepName}
                    onChange={(e) => setStepName(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. Manager Approval"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="stepOrder"
                  className="block text-sm font-medium text-gray-700"
                >
                  Step Order <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={stepOrder}
                  onChange={(e) => setStepOrder(parseInt(e.target.value) || 1)}
                  disabled={isLoading}
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <Label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Approval Role <span className="text-red-500">*</span>
              </Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder="Select Approval Role">
                    {ApprovalRole[role as keyof typeof ApprovalRole]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* employee Selection */}
            <div className="space-y-1">
              <Label
                htmlFor="employee"
                className="block text-sm font-medium text-gray-700"
              >
                Employee (Optional)
              </Label>
              <Select
                value={employeeId}
                onValueChange={setEmployeeId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder="Select Employee (Optional">
                    {selectedEmployeeName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {employeeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Boolean Options */}
            <div className="rounded-lg px-1 py-1 space-y-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFinal}
                  onChange={(e) => setIsFinal(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">
                  Final approval step
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-2 rounded-b-xl">
            <div className="flex flex-row-reverse justify-center items-center gap-3">
              <Button
                variant="outline"
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-100"
                onClick={handleClose}
                type="button"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                type="submit"
                disabled={isLoading || !stepName.trim() || !role.trim()}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLeaveAppStepModal;
