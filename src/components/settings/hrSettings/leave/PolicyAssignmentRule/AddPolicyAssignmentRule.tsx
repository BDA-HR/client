import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, BadgePlus } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import toast from "react-hot-toast";
import type { PolicyAssignmentRuleAddDto } from "../../../../../types/core/Settings/policyAssignmentRule";
import { Priority } from "../../../../../types/core/enum";

interface AddPolicyAssignmentRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPolicyAssignmentRule: (
    policyRule: PolicyAssignmentRuleAddDto
  ) => Promise<any>;
  leavePolicyId: string;
}

const AddPolicyAssignmentRuleModal: React.FC<
  AddPolicyAssignmentRuleModalProps
> = ({ isOpen, onClose, onAddPolicyAssignmentRule, leavePolicyId }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<string>(Priority["0"]); // Default to first priority
  const [effectiveFrom, setEffectiveFrom] = useState<string>("");
  const [effectiveTo, setEffectiveTo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const priorityOptions = Object.entries(Priority);

  const resetForm = () => {
    setCode("");
    setName("");
    setPriority(Priority["0"]);
    setEffectiveFrom("");
    setEffectiveTo("");
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Code is required");
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!effectiveFrom) {
      toast.error("Effective from date is required");
      return;
    }

    setIsLoading(true);
    try {
      const payload: PolicyAssignmentRuleAddDto = {
        code: code.trim(),
        name: name.trim(),
        priority,
        effectiveFrom,
        effectiveTo: effectiveTo || null,
        leavePolicyId,
      };

      const response = await onAddPolicyAssignmentRule(payload);
      toast.success(response?.message || "Policy assignment rule created");

      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create policy assignment rule");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
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

  // Set default dates
  useEffect(() => {
    if (isOpen && !effectiveFrom) {
      const today = new Date().toISOString().split("T")[0];
      setEffectiveFrom(today);
    }
  }, [isOpen, effectiveFrom]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-xl w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-3">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} />
            <h2 className="text-lg font-semibold">
              Add Policy Assignment Rule
            </h2>
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
          <div className="px-6 py-4 space-y-4">
            {/* Code and Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-sm text-gray-700 font-medium"
                >
                  Code <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. PAR-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. Executive Leave Rule"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={priority}
                onValueChange={setPriority}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Effective Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="effectiveFrom"
                  className="text-sm text-gray-700 font-medium"
                >
                  Effective From <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="effectiveTo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Effective To <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  type="date"
                  value={effectiveTo}
                  onChange={(e) => setEffectiveTo(e.target.value)}
                  disabled={isLoading}
                  min={effectiveFrom}
                />
              </div>
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
                disabled={
                  isLoading || !code.trim() || !name.trim() || !effectiveFrom
                }
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

export default AddPolicyAssignmentRuleModal;
