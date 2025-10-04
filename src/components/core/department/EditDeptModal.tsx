import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import type { EditDeptDto, DeptListDto, UUID } from '../../../types/core/dept';
import { amharicRegex } from '../../../utils/amharic-regex';
import { DeptStat } from '../../../types/core/enum';

interface Branch {
  id: UUID;
  name: string;
  nameAm: string;
}

interface EditDeptModalProps {
  department: DeptListDto;
  branches: Branch[];
  onEditDepartment: (department: EditDeptDto) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditDeptModal: React.FC<EditDeptModalProps> = ({ 
  department, 
  branches, 
  onEditDepartment, 
  isOpen,
  onClose 
}) => {
  const [editedDepartment, setEditedDepartment] = useState<EditDeptDto>({
    id: department.id,
    name: department.name,
    nameAm: department.nameAm,
    deptStat: department.deptStat,
    branchId: department.branchId,
    rowVersion: department.rowVersion
  });
  const deptStatusOptions = Object.entries(DeptStat); 

  // Update form when department prop changes
  useEffect(() => {
    setEditedDepartment({
      id: department.id,
      name: department.name,
      nameAm: department.nameAm,
      deptStat: department.deptStat,
      branchId: department.branchId,
      rowVersion: department.rowVersion
    });
  }, [department]);

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setEditedDepartment((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UUID;
    setEditedDepartment((prev) => ({ ...prev, branchId: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DeptStat;
    setEditedDepartment((prev) => ({ ...prev, deptStat: value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedDepartment((prev) => ({ ...prev, name: value }));
  };

  const handleSubmit = () => {
    if (!editedDepartment.name || !editedDepartment.nameAm || !editedDepartment.branchId) return;

    onEditDepartment(editedDepartment);
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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
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
              />
            </div>

            {/* Branch Selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-branchId" className="text-sm text-gray-500">
                Branch <span className="text-red-500">*</span>
              </Label>
              <select
                id="edit-branchId"
                value={editedDepartment.branchId}
                onChange={handleBranchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-deptStat" className="text-sm text-gray-500">
                Status <span className="text-red-500">*</span>
              </Label>
              <select
                id="edit-deptStat"
                value={editedDepartment.deptStat}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              >
                {deptStatusOptions.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!editedDepartment.name || !editedDepartment.nameAm || !editedDepartment.branchId}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={onClose}
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