import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, PenBox } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import List from "../../../components/List/list";
import type { ListItem, UUID } from "../../../types/List/list";
import type { EditDeptDto, DeptListDto } from "../../../types/core/dept";
import { amharicRegex } from "../../../utils/amharic-regex";
import { DeptStat } from "../../../types/core/enum";
import { useBranchCompanyList } from "../../../services/core/branch/branch.queries"
import toast from "react-hot-toast";

interface EditDeptModalProps {
  department: DeptListDto;
  onEditDepartment: (department: EditDeptDto) => Promise<any>;
  isOpen: boolean;
  onClose: () => void;
}

const EditDeptModal: React.FC<EditDeptModalProps> = ({
  department,
  onEditDepartment,
  isOpen,
  onClose,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<UUID | undefined>(
    department.branchId
  );
  const [editedDepartment, setEditedDepartment] = useState<EditDeptDto>({
    id: department.id,
    name: department.name,
    nameAm: department.nameAm,
    deptStat: department.deptStat,
    branchId: department.branchId,
    rowVersion: department.rowVersion,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use React Query to fetch branches
  const {
    data: branches = [],
    isLoading: loadingBranches,
    isError: branchesError,
    refetch: refetchBranches,
  } = useBranchCompanyList();

  const deptStatusOptions = Object.entries(DeptStat);

  // Update form when department prop changes
  useEffect(() => {
    setEditedDepartment({
      id: department.id,
      name: department.name,
      nameAm: department.nameAm,
      deptStat: department.deptStat,
      branchId: department.branchId,
      rowVersion: department.rowVersion,
    });
    setSelectedBranch(department.branchId);
  }, [department]);

  const branchListItems: ListItem[] = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
  }));

  // Find the selected branch name to display as placeholder
  const selectedBranchItem = branches.find(
    (branch) => branch.id === selectedBranch
  );
  const branchPlaceholder = selectedBranchItem
    ? selectedBranchItem.name
    : "Select a branch";

  const handleSelectBranch = (item: ListItem) => {
    setSelectedBranch(item.id);
    setEditedDepartment((prev) => ({ ...prev, branchId: item.id }));
  };

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || amharicRegex.test(value)) {
      setEditedDepartment((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleStatusChange = (value: string) => {
    setEditedDepartment((prev) => ({ ...prev, deptStat: value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedDepartment((prev) => ({ ...prev, name: value }));
  };

  const handleSubmit = async () => {
    if (
      !editedDepartment.name ||
      !editedDepartment.nameAm ||
      !editedDepartment.branchId
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await onEditDepartment(editedDepartment);

      const successMessage =
        response?.data?.message ||
        response?.message ||
        "Department updated successfully!";

      toast.success(successMessage);

      onClose();
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to update department. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating department:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <PenBox size={20} />
            <h2 className="text-lg font-bold text-gray-800">Edit</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Branch Selection using List Component */}
            <div className="space-y-2">
              <List
                items={branchListItems}
                selectedValue={selectedBranch}
                onSelect={handleSelectBranch}
                label="Branch"
                placeholder={branchPlaceholder}
                required
                disabled={loadingBranches || isSubmitting}
              />
              {loadingBranches && (
                <p className="text-sm text-gray-500">Loading branches...</p>
              )}
              {branchesError && (
                <div className="text-sm text-red-600">
                  Failed to load branches.{" "}
                  <button
                    onClick={() => refetchBranches()}
                    className="text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Department Names */}
            <div className="space-y-2">
              <Label htmlFor="edit-nameAm" className="text-sm text-gray-500">
                የዲፓርትመንት ስም <span className="text-red-500">*</span>
              </Label>
              <input
                id="edit-nameAm"
                value={editedDepartment.nameAm}
                onChange={handleAmharicChange}
                placeholder="ፋይናንስ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm text-gray-500">
                Department Name <span className="text-red-500">*</span>
              </Label>
              <input
                id="edit-name"
                value={editedDepartment.name}
                onChange={handleNameChange}
                placeholder="Finance"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            {/* Status Selection using Select Component */}
            <div className="space-y-2">
              <Label htmlFor="edit-deptStat" className="text-sm text-gray-500">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editedDepartment.deptStat}
                onValueChange={handleStatusChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {deptStatusOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={
                !editedDepartment.name ||
                !editedDepartment.nameAm ||
                !editedDepartment.branchId ||
                isSubmitting
              }
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditDeptModal;
