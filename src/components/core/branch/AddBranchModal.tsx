import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { AddBranchDto, UUID } from '../../../types/core/branch';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBranch: (branchData: AddBranchDto) => void;
  defaultCompanyId?: string;
  companyName?: string;
}

export const AddBranchModal: React.FC<AddBranchModalProps> = ({ 
  isOpen, 
  onClose,
  onAddBranch,
  defaultCompanyId,
  companyName = '' // Default to empty string
}) => {
  const [branchName, setBranchName] = useState('');
  const [branchNameAm, setBranchNameAm] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchLocation, setBranchLocation] = useState('');

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value) || value === '') {
      setBranchNameAm(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (branchName.trim() && defaultCompanyId) {
      const branchData: AddBranchDto = {
        name: branchName.trim(),
        nameAm: branchNameAm.trim(),
        code: branchCode.trim(),
        location: branchLocation.trim(),
        branchStat: 'ACTIVE',
        compId: defaultCompanyId as UUID
      };
      
      onAddBranch(branchData);
      setBranchName('');
      setBranchNameAm('');
      setBranchCode('');
      setBranchLocation('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 h-screen"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-6 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Branch</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {defaultCompanyId && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Adding branch to: <span className="font-semibold">{companyName || `Company ID: ${defaultCompanyId}`}</span>
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="branchNameAm" className="text-base font-medium">
                    Branch Name (Amharic)
                  </Label>
                  <Input
                    id="branchNameAm"
                    type="text"
                    placeholder="የምዝግብ ስም አስገባ"
                    value={branchNameAm}
                    onChange={handleAmharicChange}
                    className="w-full h-12 text-lg"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amharic characters only</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchName" className="text-base font-medium">
                    Branch Name (English) *
                  </Label>
                  <Input
                    id="branchName"
                    type="text"
                    placeholder="Enter branch name"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    required
                    className="w-full h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchCode" className="text-base font-medium">
                    Branch Code
                  </Label>
                  <Input
                    id="branchCode"
                    type="text"
                    placeholder="Enter branch code"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    className="w-full h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchLocation" className="text-base font-medium">
                    Location
                  </Label>
                  <Input
                    id="branchLocation"
                    type="text"
                    placeholder="Enter location"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    className="w-full h-12 text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer h-11 px-8 text-base"
                  disabled={!branchName.trim() || !defaultCompanyId}
                >
                  Add Branch
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="h-11 px-6 text-base cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};