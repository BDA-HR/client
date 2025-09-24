import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { PenBox } from 'lucide-react';
import type { EditDeptDto, DeptListDto, UUID } from '../../../types/core/dept';
import { amharicRegex } from '../../../utils/amharic-regex';
import { DeptStat } from '../../../types/core/enum';

interface Branch {
  id: UUID; // Change from string to UUID
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

  // Fix the branchId change handler to ensure it's treated as UUID
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UUID; // Cast to UUID type
    setEditedDepartment((prev) => ({ ...prev, branchId: value }));
  };

  // Fix the status change handler
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEditedDepartment((prev) => ({ ...prev, deptStat: value }));
  };

  // Fix the name change handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditedDepartment((prev) => ({ ...prev, name: value }));
  };

  const handleSubmit = () => {
    if (!editedDepartment.name || !editedDepartment.nameAm || !editedDepartment.branchId) return;

    onEditDepartment(editedDepartment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className='border-b pb-3 flex flex-row justify-between items-center'>
          <div>
            <DialogTitle className='flex items-center gap-2'>
              <PenBox size={20} /> Edit Department
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-nameAm">የዲፓርትመንት ስም</Label>
            <input
              id="edit-nameAm"
              value={editedDepartment.nameAm}
              onChange={handleAmharicChange}
              placeholder="ፋይናንስ"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name">Department Name</Label>
            <input
              id="edit-name"
              value={editedDepartment.name}
              onChange={handleNameChange}
              placeholder="Finance"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-branchId">Branch</Label>
            <select
              id="edit-branchId"
              value={editedDepartment.branchId}
              onChange={handleBranchChange}
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-deptStat">Status</Label>
            <select
              id="edit-deptStat"
              value={editedDepartment.deptStat}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            >
              <option value={DeptStat.Active}>Active</option>
              <option value={DeptStat.InAct}>Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
            onClick={handleSubmit}
            disabled={!editedDepartment.name || !editedDepartment.nameAm || !editedDepartment.branchId}
          >
            Update
          </Button>
          <Button variant={'outline'} className='cursor-pointer' onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDeptModal;