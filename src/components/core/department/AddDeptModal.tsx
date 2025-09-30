import { useState, useEffect } from 'react';
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
import type { BranchCompListDto } from '../../../types/core/branch';
import { amharicRegex } from '../../../utils/amharic-regex';
import { branchService } from '../../../services/core/branchservice';

interface AddDeptModalProps {
  onAddDepartment: (department: AddDeptDto) => void;
}

const AddDeptModal: React.FC<AddDeptModalProps> = ({ onAddDepartment }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [branches, setBranches] = useState<BranchCompListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ 
    name: '', 
    nameAm: '',
    branchId: '' as UUID
  });

  useEffect(() => {
    if (openDialog) {
      fetchBranches();
    }
  }, [openDialog]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const branchesData = await branchService.getBranchCompanyList();
      setBranches(branchesData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setNewDepartment((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value as UUID;
    setNewDepartment((prev) => ({ ...prev, branchId }));
  };

  const handleSubmit = () => {
    if (!newDepartment.name || !newDepartment.nameAm || !newDepartment.branchId) return;

    onAddDepartment({
      name: newDepartment.name,
      nameAm: newDepartment.nameAm,
      branchId: newDepartment.branchId,
    });

    // Reset form
    setNewDepartment({ 
      name: '', 
      nameAm: '',       
      branchId: '' as UUID
    });
    setOpenDialog(false);
  };

  const isFormValid = newDepartment.name && newDepartment.nameAm && newDepartment.branchId;

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
            <DialogTitle className='flex items-center gap-2'> <BadgePlus size={20}/> Add New Department</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          {/* Branch Selection Dropdown */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="branch">Select Branch<span className='text-red-500'>*</span></Label>
            <select
              id="branch"
              value={newDepartment.branchId}
              onChange={handleBranchChange}
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md bg-white"
              disabled={loading}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {loading && <p className="text-sm text-gray-500">Loading branches...</p>}
          </div>

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
            disabled={!isFormValid}
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