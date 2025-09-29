import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { BadgePlus } from 'lucide-react';
import type { AddDeptDto, UUID } from '../../../types/core/dept';
import { amharicRegex } from '../../../utils/amharic-regex';
import { DeptStat } from '../../../types/core/enum';

interface AddDeptModalProps {
  onAddDepartment: (department: AddDeptDto) => void;
  branchId: string;
}

const AddDeptModal: React.FC<AddDeptModalProps> = ({ onAddDepartment, branchId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ 
    name: '', 
    nameAm: '', 
    deptStat: DeptStat["0"],
    branchId: branchId
  });

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setNewDepartment((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleSubmit = () => {
    if (!newDepartment.name || !newDepartment.nameAm) return;

    onAddDepartment({
      name: newDepartment.name,
      nameAm: newDepartment.nameAm,
      deptStat: newDepartment.deptStat,
      branchId: newDepartment.branchId as UUID,
    });

    setNewDepartment({ 
      name: '', 
      nameAm: '', 
      deptStat: DeptStat["0"],
      branchId: branchId 
    });
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
        >
          <BadgePlus size={18} />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className='border-b pb-3 flex flex-row justify-between items-center'>
          <div>
            <DialogTitle className='flex items-center gap-2'> <BadgePlus size={20}/> Add New</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameAm">የዲፓርትመንት ስም<span className='text-red-500'>*</span></Label>
            <input
              id="nameAm"
              value={newDepartment.nameAm}
              onChange={handleAmharicChange}
              placeholder="ፋይናንስ"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Department Name<span className='text-red-500'>*</span></Label>
            <input
              id="name"
              value={newDepartment.name}
              onChange={(e) =>
                setNewDepartment((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Finance"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
            onClick={handleSubmit}
            disabled={!newDepartment.name || !newDepartment.nameAm}
          >
            Save
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'} className='cursor-pointer'>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeptModal;