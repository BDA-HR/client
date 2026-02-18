import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, BadgePlus } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../../../ui/select";
import type { LeaveTypeAddDto } from "../../../../../types/core/Settings/leavetype";
import { LeaveCategory, type LeaveCategory as LeaveCategoryType, } from "../../../../../types/core/enum";
import toast from "react-hot-toast";

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
  const [name, setName] = useState("");
  const [leaveCategory, setLeaveCategory] = useState<LeaveCategoryType>(LeaveCategory["0"]); // Paid
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [allowHalfDay, setAllowHalfDay] = useState(false);
  const [holidaysAsLeave, setHolidaysAsLeave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const leaveCategoryOptions = Object.values(LeaveCategory);
 const getLeaveCategoryKey = (value: LeaveCategory): string => {
   const key =  Object.keys(LeaveCategory).find(
       (k) => LeaveCategory[k as keyof typeof LeaveCategory] === value,
     );
     return key ?? "";
 };


  const resetForm = () => {
    setName("");
    setLeaveCategory(LeaveCategory["0"]);
    setRequiresApproval(true);
    setAllowHalfDay(false);
    setHolidaysAsLeave(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault(); 
    if (!name.trim()) {
      toast.error("Leave type name is required");
      return;
    }

    setIsLoading(true);
    try {
      const payload: LeaveTypeAddDto = {
        name: name.trim(),
        leaveCategory: getLeaveCategoryKey(leaveCategory),
        requiresApproval,
        allowHalfDay,
        holidaysAsLeave,
      };
      console.log("lt data", payload);
      const response = await onAddLeaveType(payload);
      toast.success(response?.message || "Leave type created");

      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create leave type");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-3">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} />
            <h2 className="text-lg font-semibold">Add Leave Type</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>


        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="px-6 py-4 space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minDurPerReq" className="text-sm text-gray-700 font-medium">
                  Leave Type Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. Annual Leave"
                  />
                </div>
              </div>

              {/* Leave Category */}
              <div className="space-y-2">
                <Label htmlFor="fiscalYear" className="block text-sm font-medium text-gray-700">
                  Leave Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={leaveCategory}
                  onValueChange={(v) =>
                    setLeaveCategory(v as LeaveCategoryType)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                    <SelectValue placeholder="Select Leave Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveCategoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Boolean Options Inline */}
            <div className="rounded-lg border p-4 space-y-3">
              <Label className="text-sm text-gray-500">Leave Rules</Label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresApproval}
                  onChange={(e) => setRequiresApproval(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">Requires approval</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowHalfDay}
                  onChange={(e) => setAllowHalfDay(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">Allow half-day leave</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={holidaysAsLeave}
                  onChange={(e) => setHolidaysAsLeave(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">Count holidays as leave</span>
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
                disabled={isLoading || !name.trim()}
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

export default AddLeaveTypeModal;
