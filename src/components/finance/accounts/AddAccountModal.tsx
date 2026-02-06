import React, { useState } from 'react';
import type { UUID } from 'crypto';
import { motion } from 'framer-motion';
import { X, BadgePlus, Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import List from '../../List/list'; // Import the List component
import useToast from '../../../hooks/useToast';

interface AccountFormData {
  code: string;
  name: string;
  type: string;
  level: number;
  parentAccountId?: UUID;
  description?: string;
  openingBalance: number;
  status: 'Active' | 'Inactive';
}

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: AccountFormData) => Promise<any>;
  parentAccounts?: Array<{
    id: UUID;
    code: string;
    name: string;
    level: number;
    type: string;
  }>;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddAccount, 
  parentAccounts = [] 
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<AccountFormData>({
    code: '',
    name: '',
    type: 'Asset',
    level: 1,
    parentAccountId: undefined,
    description: '',
    openingBalance: 0,
    status: 'Active'
  });

  const accountTypes = [
    { value: 'Asset', label: 'Asset', icon: <TrendingUp size={16} />, color: 'text-indigo-600' },
    { value: 'Liability', label: 'Liability', icon: <TrendingDown size={16} />, color: 'text-rose-600' },
    { value: 'Equity', label: 'Equity', icon: <DollarSign size={16} />, color: 'text-emerald-600' },
    { value: 'Revenue', label: 'Revenue', icon: <TrendingUp size={16} />, color: 'text-green-600' },
    { value: 'Expense', label: 'Expense', icon: <TrendingDown size={16} />, color: 'text-amber-600' }
  ];

  const accountLevels = [
    { value: 1, label: 'Level 1 - Main Category' },
    { value: 2, label: 'Level 2 - Sub Category' },
    { value: 3, label: 'Level 3 - Detail Account' },
    { value: 4, label: 'Level 4 - Sub Account' }
  ];

  const handleLevelChange = (value: number) => {
    setFormData(prev => ({ 
      ...prev, 
      level: value,
      parentAccountId: value === 1 ? undefined : prev.parentAccountId
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleParentAccountSelect = (selectedItem: { id: UUID; name: string }) => {
    setFormData(prev => ({ 
      ...prev, 
      parentAccountId: selectedItem.id 
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.code.trim()) {
      toast.error('Please enter an account code');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter an account name');
      return;
    }

    if (!formData.type) {
      toast.error('Please select an account type');
      return;
    }

    if (formData.level > 1 && !formData.parentAccountId) {
      toast.error('Please select a parent account for sub-accounts');
      return;
    }

    // Validate account code format (e.g., should be numeric)
    if (!/^\d+$/.test(formData.code)) {
      toast.error('Account code should contain only numbers');
      return;
    }

    setIsLoading(true);

    // Show loading toast
    const loadingToastId = toast.loading('Creating account...');

    try {
      const response = await onAddAccount(formData);
      toast.dismiss(loadingToastId);

      // Extract success message from backend response
      const successMessage = 
        response?.data?.message || 
        response?.message || 
        'Account created successfully!';
      
      toast.success(successMessage);
      
      // Reset form and close modal
      resetForm();
      onClose();
      
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      
      const errorMessage = 
        error.response?.data?.message ||
        error.message || 
        'Failed to create account. Please try again.';
      
      toast.error(errorMessage);
      console.error('Error creating account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: 'Asset',
      level: 1,
      parentAccountId: undefined,
      description: '',
      openingBalance: 0,
      status: 'Active'
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Filter parent accounts based on selected level and type
  const filteredParentAccounts = parentAccounts.filter(account => 
    account.level < formData.level && 
    account.type === formData.type
  );

  // Format parent accounts for List component
  const listParentAccounts = filteredParentAccounts.map(account => ({
    id: account.id,
    name: `${account.code} - ${account.name} (Level ${account.level})`
  }));

  // Format account types for List component
  const listAccountTypes = accountTypes.map(type => ({
    id: type.value as UUID,
    name: type.label
  }));

  // Format account levels for List component
  const listAccountLevels = accountLevels.map(level => ({
    id: level.value.toString() as UUID,
    name: level.label
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-dvh">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-1/2 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
              <BadgePlus className="text-indigo-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Add New</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Code */}
            <div className="space-y-2">
              <Label htmlFor="accountCode" className="text-sm text-gray-700">
                Account Code <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <Input
                  id="accountCode"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., 1000, 1100"
                  className="pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border-indigo-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm text-gray-700">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="accountName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Cash & Bank, Accounts Receivable"
                className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border-indigo-200"
                disabled={isLoading}
              />
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <List
                items={listAccountTypes}
                selectedValue={formData.type as UUID}
                onSelect={(item) => handleTypeChange(item.id as string)}
                label="Account Type"
                placeholder="Select account type"
                disabled={isLoading}
                required={true}
                className="mb-0"
              />
            </div>

            {/* Account Level */}
            <div className="space-y-2">
              <List
                items={listAccountLevels}
                selectedValue={formData.level.toString() as UUID}
                onSelect={(item) => handleLevelChange(parseInt(item.id as string))}
                label="Account Level"
                placeholder="Select account level"
                disabled={isLoading}
                required={true}
                className="mb-0"
              />
            </div>

            {/* Parent Account (only for levels > 1) */}
            {formData.level > 1 && (
              <div className="md:col-span-2 space-y-2">
                <List
                  items={listParentAccounts}
                  selectedValue={formData.parentAccountId}
                  onSelect={handleParentAccountSelect}
                  label="Parent Account"
                  placeholder="Select parent account"
                  disabled={isLoading || filteredParentAccounts.length === 0}
                  required={true}
                  className="mb-0"
                />
                {filteredParentAccounts.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    Note: Create Level {formData.level - 1} accounts first or select a different account type
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            {/* Opening Balance */}
            <div className="space-y-2">
              <Label htmlFor="openingBalance" className="text-sm text-gray-700">
                Opening Balance
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <Input
                  id="openingBalance"
                  type="number"
                  value={formData.openingBalance}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    openingBalance: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0.00"
                  className="pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border-indigo-200"
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-2">
              <Label htmlFor="accountStatus" className="text-sm text-gray-700">
                Account Status
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === 'Active'}
                    onChange={() => setFormData(prev => ({ ...prev, status: 'Active' }))}
                    disabled={isLoading}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-emerald-600 font-medium">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === 'Inactive'}
                    onChange={() => setFormData(prev => ({ ...prev, status: 'Inactive' }))}
                    disabled={isLoading}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-500">Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with centered buttons */}
        <div className="border-t px-6 py-4 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex justify-center items-center gap-3">
            <Button
              variant="outline"
              className="cursor-pointer px-6 border-indigo-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white cursor-pointer px-8 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saveing...
                </div>
              ) : 'Save'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddAccountModal;