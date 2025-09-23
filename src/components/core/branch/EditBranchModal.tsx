import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { EditBranchDto, BranchListDto, UUID } from '../../../types/core/branch';
import { PenBox } from 'lucide-react';
import { BranchType, BranchStat } from '../../../types/core/enum';

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
    branchType: BranchType.LocOff, // Use enum default
    branchStat: BranchStat.Active, // Use enum default
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
        branchType: branch.branchType || BranchType.LocOff, // Use enum
        branchStat: branch.branchStat || BranchStat.Active, // Use enum
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <PenBox size={20} />
            Edit
          </DialogTitle>
          <DialogDescription className="hidden">Edit Branch Details</DialogDescription>
        </DialogHeader>

        {defaultCompanyId && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Editing branch for: <span className="font-semibold">{companyName || `Company ID: ${defaultCompanyId}`}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
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
                className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.nameAm && <p className="text-red-500 text-sm">{errors.nameAm}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchName" className="text-base font-medium">
                Branch Name (English)
              </Label>
              <Input
                id="branchName"
                type="text"
                placeholder="Enter branch name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchCode" className="text-base font-medium">
                Branch Code
              </Label>
              <Input
                id="branchCode"
                type="text"
                placeholder="Enter branch code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                required
                className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchLocation" className="text-base font-medium">
                Location
              </Label>
              <Input
                id="branchLocation"
                type="text"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOpened" className="text-base font-medium">
                Date Opened
              </Label>
              <Input
                id="dateOpened"
                type="date"
                value={formData.dateOpened}
                onChange={(e) => handleInputChange('dateOpened', e.target.value)}
                required
                className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.dateOpened && <p className="text-red-500 text-sm">{errors.dateOpened}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchStat" className="text-base font-medium">
                Status
              </Label>
              <Select
                value={formData.branchStat}
                onValueChange={(value) => handleInputChange('branchStat', value)}
              >
                <SelectTrigger className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {branchStatOptions.map((option) => (
                    <SelectItem key={option.key} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branchStat && <p className="text-red-500 text-sm">{errors.branchStat}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchType" className="text-base font-medium">
                Branch Type
              </Label>
              <Select
                value={formData.branchType}
                onValueChange={(value) => handleInputChange('branchType', value)}
              >
                <SelectTrigger className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {branchTypeOptions.map((option) => (
                    <SelectItem key={option.key} value={option.value}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branchType && <p className="text-red-500 text-sm">{errors.branchType}</p>}
            </div>
          </div>

          <div className="flex justify-center items-center gap-1.5 border-t pt-6">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer h-11 px-8 text-base focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              disabled={!formData.name.trim() || !formData.code.trim() || !formData.location.trim() || !formData.compId}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-11 px-6 text-base cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};