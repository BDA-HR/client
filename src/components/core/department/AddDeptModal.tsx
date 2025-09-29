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
import type { BranchCompListDto, BranchListDto } from '../../../types/core/branch';
import { amharicRegex } from '../../../utils/amharic-regex';
import { DeptStat } from '../../../types/core/enum';
import { branchService } from '../../../services/core/branchservice';

interface AddDeptModalProps {
  onAddDepartment: (department: AddDeptDto) => void;
}

const AddDeptModal: React.FC<AddDeptModalProps> = ({ onAddDepartment }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [companies, setCompanies] = useState<BranchCompListDto[]>([]);
  const [branches, setBranches] = useState<BranchListDto[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<UUID | ''>('');
  const [selectedBranchId, setSelectedBranchId] = useState<UUID | ''>('');
  const [loading, setLoading] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ 
    name: '', 
    nameAm: '', 
    deptStat: DeptStat["0"],
    branchId: '' as UUID
  });

  // Fetch companies when modal opens
  useEffect(() => {
    if (openDialog) {
      fetchCompanies();
    }
  }, [openDialog]);

  useEffect(() => {
    if (!openDialog) {
      resetForm();
    }
  }, [openDialog]);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchCompanyBranches(selectedCompanyId);
    } else {
      setBranches([]);
      setSelectedBranchId('');
    }
  }, [selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const companiesData = await branchService.getBranchCompanyList();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyBranches = async (companyId: UUID) => {
    try {
      setLoading(true);
      const branchesData = await branchService.getCompanyBranches(companyId);
      setBranches(branchesData);
    } catch (error) {
      console.error('Error fetching company branches:', error);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCompanyId('');
    setSelectedBranchId('');
    setBranches([]);
    setNewDepartment({ 
      name: '', 
      nameAm: '', 
      deptStat: DeptStat["0"],
      branchId: '' as UUID
    });
  };

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setNewDepartment((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value as UUID;
    setSelectedCompanyId(companyId);
    setSelectedBranchId('');
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value as UUID;
    setSelectedBranchId(branchId);
    setNewDepartment((prev) => ({ ...prev, branchId }));
  };

  const handleSubmit = () => {
    if (!newDepartment.name || !newDepartment.nameAm || !selectedBranchId) return;

    onAddDepartment({
      name: newDepartment.name,
      nameAm: newDepartment.nameAm,
      deptStat: newDepartment.deptStat,
      branchId: selectedBranchId as UUID,
    });

    setOpenDialog(false);
  };

  const isFormValid = newDepartment.name && newDepartment.nameAm && selectedBranchId;

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
            <DialogTitle className='flex items-center gap-2'> 
              <BadgePlus size={20}/> Add New
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          {/* Company Selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="company">Company<span className='text-red-500'>*</span></Label>
            <select
              id="company"
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md bg-white"
              disabled={loading}
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="branch">Branch<span className='text-red-500'>*</span></Label>
            <select
              id="branch"
              value={selectedBranchId}
              onChange={handleBranchChange}
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md bg-white"
              disabled={!selectedCompanyId || loading}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {selectedCompanyId && branches.length === 0 && !loading && (
              <p className="text-sm text-amber-600">No branches found for this company</p>
            )}
          </div>

          {/* Department Name in Amharic */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameAm">የዲፓርትመንት ስም<span className='text-red-500'>*</span></Label>
            <input
              id="nameAm"
              value={newDepartment.nameAm}
              onChange={handleAmharicChange}
              placeholder="ፋይናንስ"
              className="w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md"
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-1.5 border-t pt-6">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
          >
            {loading ? 'Loading...' : 'Save'}
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'} className='cursor-pointer' disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeptModal;