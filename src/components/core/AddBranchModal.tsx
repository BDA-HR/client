import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBranch: (branchName: string, branchNameAm: string) => void;
}

export const AddBranchModal: React.FC<AddBranchModalProps> = ({ 
  isOpen, 
  onClose,
  onAddBranch 
}) => {
  const [branchName, setBranchName] = useState('');
  const [branchNameAm, setBranchNameAm] = useState('');
  const amharicRegex = /^[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\s]*$/;

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value) || value === '') {
      setBranchNameAm(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (branchName.trim()) {
      onAddBranch(branchName, branchNameAm);
      setBranchName('');
      setBranchNameAm('');
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
              <div>
                <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name (English)
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
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={!branchName.trim()}
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