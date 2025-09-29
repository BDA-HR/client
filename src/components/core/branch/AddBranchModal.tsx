import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { BadgePlus, } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { AddBranchDto, UUID } from '../../../types/core/branch';
import { BranchType, BranchStat } from '../../../types/core/enum'; 

interface AddBranchModalProps {
  onAddBranch: (branch: AddBranchDto) => void;
  defaultCompanyId?: string;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({
  onAddBranch,
  defaultCompanyId,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchNameAm, setBranchNameAm] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [dateOpened, setDateOpened] = useState(() => new Date().toISOString().split('T')[0]); // Current date in YYYY-MM-DD format
  const [branchType, setBranchType] = useState<keyof typeof BranchType>('0'); // Store the key, not the value
  const branchTypeOptions = Object.entries(BranchType).map(([key, value]) => ({
    key,
    value
  }));  
  const [branchStat, setBranchStat] = useState<keyof typeof BranchStat>('0'); 

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
      dateOpened: new Date(dateOpened).toISOString(), // Convert to ISO string
      branchType: branchType, // This will now be the key ('0', '1', '2', '3')
      branchStat: branchStat,
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
    setBranchStat('0');
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer">
          <BadgePlus size={18} />
          Add Branch
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()} // Prevent close on outside click
      >
        <DialogHeader className="border-b pb-3 flex flex-row justify-between items-center">
          <div>
            <DialogTitle className='flex items-center gap-2'> <BadgePlus size={20}/> Add New</DialogTitle>
            <DialogDescription className="hidden">Add New</DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="branchNameAm">የቅርንጫፍ ስም (አማርኛ) <span className='text-red-500'>*</span></Label>
            <Input
              id="branchNameAm"
              value={branchNameAm}
              onChange={handleAmharicChange}
              placeholder="ምሳሌ፡ ቅርንጫፍ 1"
              className="w-full h-11 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="branchName">Branch Name (English) <span className='text-red-500'>*</span></Label>
            <Input
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Eg. Branch 1"
              className="w-full h-11 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="branchCode">Branch Code <span className='text-red-500'>*</span></Label>
              <Input
                id="branchCode"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                placeholder="Eg. BR-001"
                className="w-full h-11 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="dateOpened">Date Opened</Label>
              <Input
                id="dateOpened"
                type="date"
                value={dateOpened}
                onChange={(e) => setDateOpened(e.target.value)}
                className="w-full h-11 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="branchType">Branch Type <span className='text-red-500'>*</span></Label>
            <select
              id="branchType"
              value={branchType}
              onChange={(e) => setBranchType(e.target.value as keyof typeof BranchType)}
              className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
            >
              {branchTypeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value} {/* Display the human-readable value */}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="branchLocation">Location <span className='text-red-500'>*</span></Label>
            <Input
              id="branchLocation"
              value={branchLocation}
              onChange={(e) => setBranchLocation(e.target.value)}
              placeholder="Eg. Addis Ababa"
              className="w-full h-11 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 border-t pt-6">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
            onClick={handleSubmit}
            disabled={!branchName.trim() || !defaultCompanyId}
          >
            Save
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranchModal;