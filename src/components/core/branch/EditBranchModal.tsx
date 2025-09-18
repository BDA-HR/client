import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { EditBranchDto, BranchListDto, UUID } from '../../../types/core/branch';

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
  compId?: string;
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
    branchType: 'REGULAR',
    branchStat: 'ACTIVE',
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
        branchType: 'REGULAR',
        branchStat: branch.branchStat || 'ACTIVE',
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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(formData.compId)) {
      newErrors.compId = 'Valid Company ID (UUID) is required';
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
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && branch && (
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
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Branch - {branch.name}</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {defaultCompanyId && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Editing branch for: <span className="font-semibold">{companyName || `Company ID: ${defaultCompanyId}`}</span>
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
                    value={formData.nameAm}
                    onChange={handleAmharicChange}
                    className="w-full h-12 text-lg"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amharic characters only</p>
                  {errors.nameAm && <p className="text-red-500 text-sm">{errors.nameAm}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchName" className="text-base font-medium">
                    Branch Name (English) *
                  </Label>
                  <Input
                    id="branchName"
                    type="text"
                    placeholder="Enter branch name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full h-12 text-lg"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchCode" className="text-base font-medium">
                    Branch Code *
                  </Label>
                  <Input
                    id="branchCode"
                    type="text"
                    placeholder="Enter branch code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    required
                    className="w-full h-12 text-lg"
                  />
                  {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchLocation" className="text-base font-medium">
                    Location *
                  </Label>
                  <Input
                    id="branchLocation"
                    type="text"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                    className="w-full h-12 text-lg"
                  />
                  {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOpened" className="text-base font-medium">
                    Date Opened *
                  </Label>
                  <Input
                    id="dateOpened"
                    type="date"
                    value={formData.dateOpened}
                    onChange={(e) => handleInputChange('dateOpened', e.target.value)}
                    required
                    className="w-full h-12 text-lg"
                  />
                  {errors.dateOpened && <p className="text-red-500 text-sm">{errors.dateOpened}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchStat" className="text-base font-medium">
                    Status *
                  </Label>
                  <Select
                    value={formData.branchStat}
                    onValueChange={(value) => handleInputChange('branchStat', value)}
                  >
                    <SelectTrigger className="w-full h-12 text-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.branchStat && <p className="text-red-500 text-sm">{errors.branchStat}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchType" className="text-base font-medium">
                    Branch Type *
                  </Label>
                  <Select
                    value={formData.branchType}
                    onValueChange={(value) => handleInputChange('branchType', value)}
                  >
                    <SelectTrigger className="w-full h-12 text-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGULAR">Regular</SelectItem>
                      <SelectItem value="MAIN">Main</SelectItem>
                      <SelectItem value="SUB">Sub-branch</SelectItem>
                      <SelectItem value="MOBILE">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.branchType && <p className="text-red-500 text-sm">{errors.branchType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compId" className="text-base font-medium">
                    Company ID *
                  </Label>
                  <Input
                    id="compId"
                    type="text"
                    placeholder="Enter company ID (UUID)"
                    value={formData.compId}
                    onChange={(e) => handleInputChange('compId', e.target.value)}
                    required
                    className="w-full h-12 text-lg"
                  />
                  {errors.compId && <p className="text-red-500 text-sm">{errors.compId}</p>}
                </div>
              </div>

              <div className="flex justify-center space-x-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="h-11 px-6 text-base cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer h-11 px-8 text-base"
                  disabled={!formData.name.trim() || !formData.code.trim() || !formData.location.trim() || !formData.compId}
                >
                  Save Changes
                </Button>

              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};