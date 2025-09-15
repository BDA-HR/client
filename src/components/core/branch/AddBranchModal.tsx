import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { AddBranchDto } from '../../../types/core/branch';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBranch: (branchData: AddBranchDto) => void;
  defaultCompanyId?: string;
}

export const AddBranchModal: React.FC<AddBranchModalProps> = ({ 
  isOpen, 
  onClose,
  onAddBranch,
  defaultCompanyId 
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
        dateOpened: new Date().toISOString(), // Current date as default
        branchType: 'REGULAR', // Default value
        branchStat: 'ACTIVE', // Default value
        compId: defaultCompanyId
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 h-screen"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Add New Branch</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {defaultCompanyId && (
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    Adding branch to Company ID: {defaultCompanyId}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="branchNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name (Amharic)
                  </label>
                  <Input
                    id="branchNameAm"
                    type="text"
                    placeholder="የምዝግብ ስም አስገባ"
                    value={branchNameAm}
                    onChange={handleAmharicChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Name (English) *
                  </label>
                  <Input
                    id="branchName"
                    type="text"
                    placeholder="Enter branch name"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="branchCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch Code
                  </label>
                  <Input
                    id="branchCode"
                    type="text"
                    placeholder="Enter branch code"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="branchLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    id="branchLocation"
                    type="text"
                    placeholder="Enter location"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  disabled={!branchName.trim() || !defaultCompanyId}
                >
                  Add Branch
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};