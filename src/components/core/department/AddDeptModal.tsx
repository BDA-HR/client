import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import List from '../../../components/List/list';
import type { ListItem, UUID } from '../../../types/List/list';
import type { AddDeptDto } from '../../../types/core/dept';
import type { BranchCompListDto } from '../../../types/core/branch';
import { amharicRegex } from '../../../utils/amharic-regex';
import { branchService } from '../../../services/core/branchservice';

interface AddDeptModalProps {
  onAddDepartment: (department: AddDeptDto) => void;
}

const AddDeptModal: React.FC<AddDeptModalProps> = ({ onAddDepartment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [branches, setBranches] = useState<BranchCompListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<UUID | undefined>(undefined);
  const [newDepartment, setNewDepartment] = useState({ 
    name: '', 
    nameAm: '',
    branchId: '' as UUID
  });

  useEffect(() => {
    if (isOpen) {
      fetchBranches();
    }
  }, [isOpen]);

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

  const branchListItems: ListItem[] = branches.map(branch => ({
    id: branch.id,
    name: branch.name
  }));

  const handleSelectBranch = (item: ListItem) => {
    setSelectedBranch(item.id);
    setNewDepartment(prev => ({ ...prev, branchId: item.id }));
  };

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setNewDepartment((prev) => ({ ...prev, nameAm: value }));
    }
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
    setSelectedBranch(undefined);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isFormValid = newDepartment.name && newDepartment.nameAm && newDepartment.branchId;

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
      >
        <BadgePlus size={18} />
        Add Department
      </Button>

      {/* Modal */}
      {isOpen && (
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
                <BadgePlus size={20} />
                <h2 className="text-lg font-bold text-gray-800">Add New</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
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
                    label="Select Branch"
                    placeholder="Select a branch"
                    required
                    disabled={loading}
                  />
                  {loading && <p className="text-sm text-gray-500">Loading branches...</p>}
                </div>

                {/* Department Names */}
                <div className="space-y-2">
                  <Label htmlFor="nameAm" className="text-sm text-gray-500">
                    የዲፓርትመንት ስም <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="nameAm"
                    value={newDepartment.nameAm}
                    onChange={handleAmharicChange}
                    placeholder="ፋይናንስ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-gray-500">
                    Department Name <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="name"
                    value={newDepartment.name}
                    onChange={(e) =>
                      setNewDepartment((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Finance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-2">
              <div className="mx-auto flex justify-center items-center gap-1.5">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer px-6"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AddDeptModal;