import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { EditBranchDto, BranchListDto, UUID } from '../../../types/core/branch';
import { BranchType, BranchStat } from '../../../types/core/enum';
import { Button } from '../../ui/button';

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branchData: EditBranchDto) => void;
  branch: BranchListDto | null;
  defaultCompanyId?: string;
  companyName?: string;
}

interface FormErrors {
  name?: string;
  nameAm?: string;
  code?: string;
  location?: string;
  dateOpened?: string;
  branchType?: string;
  branchStat?: string;
  rowVersion?: string;
}

export const EditBranchModal: React.FC<EditBranchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  branch,
  defaultCompanyId,
  companyName = '',
}) => {
  const [formData, setFormData] = useState<EditBranchDto>({
    id: '' as UUID,
    name: '',
    nameAm: '',
    code: '',
    location: '',
    dateOpened: new Date().toISOString().split('T')[0],
    branchType: '0',
    branchStat: '0',
    compId: (defaultCompanyId || '') as UUID,
    rowVersion: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (branch) {
      setFormData({
        id: branch.id,
        name: branch.name || '',
        nameAm: branch.nameAm || '',
        code: branch.code || '',
        location: branch.location || '',
        dateOpened: branch.dateOpened
          ? new Date(branch.dateOpened).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        branchType: branch.branchType || '0',
        branchStat: branch.branchStat || '0',
        compId: (defaultCompanyId || '') as UUID,
        rowVersion: branch.rowVersion || '',
      });
    }
  }, [branch, defaultCompanyId]);

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value) || value === '') {
      setFormData((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleInputChange = (field: keyof EditBranchDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Branch code is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.dateOpened) {
      newErrors.dateOpened = 'Date opened is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData: EditBranchDto = {
        ...formData,
        dateOpened: new Date(formData.dateOpened).toISOString(),
      };
      onSave(submitData);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const branchTypeOptions = Object.entries(BranchType).map(([key, value]) => ({
    key,
    value
  }));

  const branchStatOptions = Object.entries(BranchStat).map(([key, value]) => ({
    key,
    value
  }));

  const getDisplayValue = (currentKey: string, options: Array<{key: string, value: string}>) => {
    const option = options.find(opt => opt.key === currentKey);
    return option ? option.value : currentKey;
  };

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <PenBox size={20} />
            <h2 className="text-lg font-bold text-gray-800">Edit</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {defaultCompanyId && (
          <div className="bg-blue-50 p-4 mx-6 mt-4 rounded-lg border border-blue-100 hidden">
            <p className="text-sm text-blue-700 font-medium">
              Editing branch for: <span className="font-semibold">{companyName || `Company ID: ${defaultCompanyId}`}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Branch Names */}
            <div className="space-y-2">
              <Label htmlFor="branchNameAm" className="text-sm text-gray-500">
                Branch Name (Amharic)
              </Label>
              <Input
                id="branchNameAm"
                type="text"
                placeholder="የምዝግብ ስም አስገባ"
                value={formData.nameAm}
                onChange={handleAmharicChange}
                className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.nameAm && <p className="text-red-500 text-sm">{errors.nameAm}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchName" className="text-sm text-gray-500">
                Branch Name (English)
              </Label>
              <Input
                id="branchName"
                type="text"
                placeholder="Enter branch name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Branch Code and Date Opened - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branchCode" className="text-sm text-gray-500">
                  Branch Code
                </Label>
                <Input
                  id="branchCode"
                  type="text"
                  placeholder="Enter branch code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  required
                  className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOpened" className="text-sm text-gray-500">
                  Date Opened
                </Label>
                <Input
                  id="dateOpened"
                  type="date"
                  value={formData.dateOpened}
                  onChange={(e) => handleInputChange('dateOpened', e.target.value)}
                  required
                  className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.dateOpened && <p className="text-red-500 text-sm">{errors.dateOpened}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="branchLocation" className="text-sm text-gray-500">
                Location
              </Label>
              <Input
                id="branchLocation"
                type="text"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>

            {/* Status and Branch Type - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branchStat" className="text-sm text-gray-500">
                  Status
                </Label>
                <Select
                  value={formData.branchStat}
                  onValueChange={(value) => handleInputChange('branchStat', value)}
                >
                  <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                    <SelectValue>
                      {getDisplayValue(formData.branchStat, branchStatOptions)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {branchStatOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branchStat && <p className="text-red-500 text-sm">{errors.branchStat}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchType" className="text-sm text-gray-500">
                  Branch Type
                </Label>
                <Select
                  value={formData.branchType}
                  onValueChange={(value) => handleInputChange('branchType', value)}
                >
                  <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                    <SelectValue>
                      {getDisplayValue(formData.branchType, branchTypeOptions)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {branchTypeOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branchType && <p className="text-red-500 text-sm">{errors.branchType}</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed structure */}
          <div className="border-t pt-6 flex justify-center gap-3">
            <Button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer px-6 text-white"
            >
              Save Changes
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="cursor-pointer px-6"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};