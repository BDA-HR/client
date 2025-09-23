import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Repeat, Building, AlertCircle } from 'lucide-react';
import type { BranchListDto, UUID } from '../../../types/core/branch';
import { BranchStat } from '../../../types/core/enum';
import React from 'react';

interface StatBranchModalProps {
  branch: BranchListDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (branchId: UUID, newStatus: string) => void;
}

const StatBranchModal: React.FC<StatBranchModalProps> = ({ 
  branch, 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<string>('');

  React.useEffect(() => {
    if (branch) {
      setSelectedStatus(branch.branchStat);
    }
  }, [branch]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case BranchStat.Active: return 'text-emerald-600 bg-emerald-100';
      case BranchStat.InAct: return 'text-red-600 bg-red-100';
      case BranchStat.UndCon: return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case BranchStat.Active: return 'Active';
      case BranchStat.InAct: return 'Inactive';
      case BranchStat.UndCon: return 'Under Construction';
      default: return status;
    }
  };

  const handleConfirm = () => {
    if (branch && selectedStatus) {
      onConfirm(branch.id, selectedStatus);
    }
  };

  if (!branch) return null;

  const currentStatus = branch.branchStat;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className='flex items-center gap-2'>
            <Repeat size={24} /> Change Status
        </DialogHeader>
        
        <div className="py-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <Building className="text-gray-600 mr-2" size={20} />
            <p className="font-medium text-lg">{branch.name}</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">{branch.nameAm}</p>
          <p className="text-sm text-gray-500 mb-6">Code: {branch.code} • {branch.location}</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-3">Status Change</p>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(currentStatus)}`}>
                  {getStatusText(currentStatus)}
                </span>
                <p className="text-xs text-gray-500 mt-1">Current Status</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                Select New Status:
              </label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={BranchStat.Active}>Active</option>
                <option value={BranchStat.InAct}>Inactive</option>
                <option value={BranchStat.UndCon}>Under Construction</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-center text-amber-600 bg-amber-50 rounded-lg p-3 mb-2">
            <AlertCircle size={16} className="mr-2" />
            <p className="text-sm font-medium">This action will immediately update the branch status</p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center items-center gap-1.5">
          <Button 
            variant="default" 
            onClick={handleConfirm}
            disabled={selectedStatus === currentStatus}
            className="cursor-pointer px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Change
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer px-6">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatBranchModal;