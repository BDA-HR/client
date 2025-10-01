import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { AddBranchDto, UUID } from '../../../types/core/branch';
import { BranchType } from '../../../types/core/enum';

interface AddBranchModalProps {
  onAddBranch: (branch: AddBranchDto) => void;
  defaultCompanyId?: string;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({
  onAddBranch,
  defaultCompanyId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchNameAm, setBranchNameAm] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [dateOpened, setDateOpened] = useState(() => new Date().toISOString().split('T')[0]);
  const [branchType, setBranchType] = useState<keyof typeof BranchType>('0');

  const branchTypeOptions = Object.entries(BranchType).map(([key, value]) => ({
    key,
    value
  }));

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setBranchNameAm(value);
    }
  };

  const handleSubmit = () => {
    if (!branchName.trim() || !defaultCompanyId) return;

    const newBranch: AddBranchDto = {
      name: branchName.trim(),
      nameAm: branchNameAm.trim(),
      code: branchCode.trim(),
      location: branchLocation.trim(),
      dateOpened: new Date(dateOpened).toISOString(),
      branchType: branchType,
      compId: defaultCompanyId as UUID,
    };

    onAddBranch(newBranch);

    // Reset form
    setBranchName('');
    setBranchNameAm('');
    setBranchCode('');
    setBranchLocation('');
    setDateOpened(new Date().toISOString().split('T')[0]);
    setBranchType('0');
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
      >
        <BadgePlus size={18} />
        Add New
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

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Branch Names */}
                <div className="space-y-2">
                  <Label htmlFor="branchNameAm" className="text-sm text-gray-500">
                    የቅርንጫፍ ስም (አማርኛ) <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id="branchNameAm"
                    value={branchNameAm}
                    onChange={handleAmharicChange}
                    placeholder="ምሳሌ፡ ቅርንጫፍ 1"
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchName" className="text-sm text-gray-500">
                    Branch Name (English) <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id="branchName"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Eg. Branch 1"
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Branch Code and Date Opened - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchCode" className="text-sm text-gray-500">
                      Branch Code <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id="branchCode"
                      value={branchCode}
                      onChange={(e) => setBranchCode(e.target.value)}
                      placeholder="Eg. BR-001"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOpened" className="text-sm text-gray-500">
                      Date Opened
                    </Label>
                    <Input
                      id="dateOpened"
                      type="date"
                      value={dateOpened}
                      onChange={(e) => setDateOpened(e.target.value)}
                      className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchType" className="text-sm text-gray-500">
                    Branch Type <span className='text-red-500'>*</span>
                  </Label>
                  <select
                    id="branchType"
                    value={branchType}
                    onChange={(e) => setBranchType(e.target.value as keyof typeof BranchType)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {branchTypeOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchLocation" className="text-sm text-gray-500">
                    Location <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id="branchLocation"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    placeholder="Eg. Addis Ababa"
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons - Kept as is */}
              <div className="border-t pt-6 flex justify-center gap-3">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
                  onClick={handleSubmit}
                  disabled={!branchName.trim() || !defaultCompanyId}
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

export default AddBranchModal;