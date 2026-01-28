import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Edit } from "lucide-react";
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
  LeaveAppStepListDto,
  LeaveAppStepModDto,
  UUID,
} from "../../../../../../types/core/Settings/leaveAppStep";
import { ApprovalRole } from "../../../../../../types/core/enum";
import type { NameListDto } from "../../../../../../types/hr/NameListDto";

interface EditLeaveAppStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStep: (stepData: LeaveAppStepModDto) => Promise<any>;
  step: LeaveAppStepListDto;
  employees: NameListDto[];
}

const EditLeaveAppStepModal: React.FC<EditLeaveAppStepModalProps> = ({
  isOpen,
  onClose,
  onUpdateStep,
  step,
  employees,
}) => {
  const [stepName, setStepName] = useState("");
  const [stepOrder, setStepOrder] = useState<number>(1);
  const [role, setRole] = useState<string>("0");
  const [isFinal, setIsFinal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>("none");
  const [isInitialized, setIsInitialized] = useState(false);

  // Create options from enum entries
  const roleOptions = useMemo(
    () =>
      Object.entries(ApprovalRole).map(([key, value]) => ({
        key,
        value,
      })),
    [],
  );

  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        value: employee.id,
        label: employee.name,
      })),
    [employees],
  );

  // Find employee ID from employee name
  const findEmployeeIdByName = useCallback(
    (employeeName: string | null): string => {
      if (!employeeName || !employeeName.trim()) {
        return "none";
      }

      // Try exact match first
      let employee = employees.find((emp) => emp.name === employeeName);

      // If no exact match, try case-insensitive match
      if (!employee) {
        employee = employees.find(
          (emp) => emp.name.toLowerCase() === employeeName.toLowerCase(),
        );
      }

      // If still no match, try partial match (contains)
      if (!employee) {
        employee = employees.find(
          (emp) =>
            emp.name.toLowerCase().includes(employeeName.toLowerCase()) ||
            employeeName.toLowerCase().includes(emp.name.toLowerCase()),
        );
      }

      return employee?.id || "none";
    },
    [employees],
  );

  const initializeForm = useCallback(() => {
    setStepName(step.stepName || "");
    setStepOrder(step.stepOrder || 1);

    // Enhanced role validation with debugging
    console.log("Looking for role:", step.role);
    const validRole = roleOptions.find((option) => {
      console.log(
        `Comparing "${option.key}" === "${step.role}":`,
        option.key === step.role,
      );
      return option.key === step.role;
    });
    console.log("Found valid role:", validRole);

    // Try different approaches to find the role
    let roleToSet = "0"; // Default fallback

    if (validRole) {
      roleToSet = step.role;
      console.log("Using exact match:", roleToSet);
    } else {
      // Try string conversion
      const roleAsString = String(step.role);
      const roleByString = roleOptions.find(
        (option) => option.key === roleAsString,
      );
      if (roleByString) {
        roleToSet = roleAsString;
        console.log("Using string conversion:", roleToSet);
      } else {
        // Try by value match (in case API returns the display name)
        const roleByValue = roleOptions.find(
          (option) => option.value === step.role,
        );
        if (roleByValue) {
          roleToSet = roleByValue.key;
          console.log("Using value match:", roleToSet);
        } else {
          console.log("No match found, using default:", roleToSet);
        }
      }
    }

    console.log("Final role to set:", roleToSet);
    setRole(roleToSet);

    setIsFinal(step.isFinal || false);

    const foundEmployeeId = findEmployeeIdByName(step.employee);
    setEmployeeId(foundEmployeeId);

    // Small delay to ensure state is set before marking as initialized
    setTimeout(() => {
      setIsInitialized(true);
      console.log("=== END ROLE DEBUGGING ===");
    }, 10);
  }, [step, findEmployeeIdByName, roleOptions]);

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
      const payload: LeaveAppStepModDto = {
        id: step.id,
        stepName: stepName.trim(),
        stepOrder,
        role: role,
        employeeId: employeeId === "none" ? null : (employeeId as UUID),
        isFinal,
        leavePolicyId: step.leavePolicyId,
        rowVersion: step.rowVersion,
      };

      console.log("Sending update payload:", payload);
      await onUpdateStep(payload);
      await new Promise((resolve) => setTimeout(resolve, 100));
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update approval step");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setIsInitialized(false);
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

  // Initialize form when modal opens or step changes
  useEffect(() => {
    if (isOpen && step && employees.length > 0) {
      setIsInitialized(false);
      initializeForm();
    }
  }, [isOpen, step, employees, initializeForm]);

  const selectedEmployee = employees.find((emp) => emp.id === employeeId);
  const selectedEmployeeName =
    employeeId === "none"
      ? "No Employee Selected"
      : selectedEmployee?.name || "";

  if (!isOpen) return null;

  // Don't render the modal if employees are not loaded yet
  if (employees.length === 0) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8"
        >
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-600">Loading employees...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Edit size={20} className="text-green-500" />
            <h2 className="text-lg font-semibold">Edit Approval Step</h2>
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
          key={step.id} // Force re-render when step changes
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Body */}
          <div className="px-6 py-4 space-y-4">
            {/* Step Name and Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
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
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Approval Role <span className="text-red-500">*</span>
              </Label>
              {isInitialized ? (
                <Select
                  value={role}
                  onValueChange={(value) => {
                    console.log("Role changed to:", value);
                    setRole(value);
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent">
                    <SelectValue placeholder="Select Approval Role" />
                  </SelectTrigger>
                  <SelectContent className="z-[70]">
                    {roleOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="w-full h-10 border border-gray-300 rounded-md flex items-center px-3 bg-gray-50">
                  <span className="text-gray-500 text-sm">Loading...</span>
                </div>
              )}
            </div>

            {/* Employee Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="employee"
                className="block text-sm font-medium text-gray-700"
              >
                Employee (Optional)
              </Label>
              <div className="relative">
                {isInitialized ? (
                  <Select
                    key={`employee-${step.id}-${employeeId}`}
                    value={employeeId}
                    onValueChange={setEmployeeId}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent">
                      <SelectValue placeholder="Select Employee (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="z-[70]">
                      <SelectItem value="none">No Employee Selected</SelectItem>
                      {employeeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="w-full h-10 border border-gray-300 rounded-md flex items-center px-3 bg-gray-50">
                    <span className="text-gray-500 text-sm">Loading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Boolean Options */}
            <div className="rounded-lg px-1 py-2 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFinal}
                  onChange={(e) => setIsFinal(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 accent-green-600"
                />
                <span className="text-sm text-gray-700">
                  Final approval step
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 rounded-b-xl">
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
                {isLoading ? "Updating..." : "Update Step"}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditLeaveAppStepModal;
