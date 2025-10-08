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
    branchType: BranchType["0"],
    branchStat: BranchStat["0"],
    compId: (defaultCompanyId || '') as UUID,
    rowVersion: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (branch) {
      setFormData({
        id: branch.id,
        name: branch.name || '',
        nameAm: branch.nameAm || '',
        code: branch.code || '',
        location: branch.location || '',
        dateOpened: formatDateForInput(branch.openDate),
        branchType: branch.branchType || BranchType["0"],
        branchStat: branch.branchStat || BranchStat["0"],
        compId: branch.compId || (defaultCompanyId as UUID) || ('' as UUID),
        rowVersion: branch.rowVersion || '',
      });
    }
  }, [branch, defaultCompanyId]);

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setFormData((prev) => ({ ...prev, nameAm: value }));
    }
    if (errors.nameAm) {
      setErrors((prev) => ({ ...prev, nameAm: undefined }));
    }
  };

  const handleInputChange = (field: keyof EditBranchDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStatusChange = (value: BranchStat) => {
    setFormData((prev) => ({ ...prev, branchStat: value }));
    if (errors.branchStat) {
      setErrors((prev) => ({ ...prev, branchStat: undefined }));
    }
  };

  const handleTypeChange = (value: BranchType) => {
    setFormData((prev) => ({ ...prev, branchType: value }));
    if (errors.branchType) {
      setErrors((prev) => ({ ...prev, branchType: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }
    if (!formData.nameAm.trim()) {
      newErrors.nameAm = 'Amharic branch name is required';
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
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Get branch type options - simplified like AddBranchModal
  const branchTypeOptions = Object.entries(BranchType).map(([key, value]) => ({
    key,
    value,
  }));

  // Get branch status options
  const branchStatOptions = Object.entries(BranchStat).map(([key, value]) => ({
    key,
    value,
  }));

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
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
          <div className="bg-blue-50 p-4 mx-6 mt-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">
              Editing branch for: <span className="font-semibold">{companyName || `Company ID: ${defaultCompanyId}`}</span>
            </p>
          </div>
        )}

        {/* Body */}
        <div className="p-6 pb-2"> {/* Reduced bottom padding from p-6 to pb-2 */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Branch Names - Amharic first like AddBranchModal */}
              <div className="space-y-2">
                <Label htmlFor="edit-branchNameAm" className="text-sm text-gray-500">
                  የቅርንጫፍ ስም (አማርኛ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-branchNameAm"
                  value={formData.nameAm}
                  onChange={handleAmharicChange}
                  placeholder="ምሳሌ፡ ቅርንጫፍ 1"
                  className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.nameAm && <p className="text-red-500 text-sm">{errors.nameAm}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-branchName" className="text-sm text-gray-500">
                  Branch Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-branchName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Eg. Branch 1"
                  className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/*Location and Date Opened - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dateOpened" className="text-sm text-gray-500">
                    Date Opened <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-dateOpened"
                    type="date"
                    value={formData.dateOpened}
                    onChange={(e) => handleInputChange('dateOpened', e.target.value)}
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.dateOpened && <p className="text-red-500 text-sm">{errors.dateOpened}</p>}
                </div>
                <div className="space-y-2">
                <Label htmlFor="edit-branchLocation" className="text-sm text-gray-500">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-branchLocation"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Eg. Addis Ababa"
                  className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>
            </div>
              {/* Branch Type and Status - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-branchType" className="text-sm text-gray-500">
                    Branch Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.branchType}
                    onValueChange={(value: BranchType) => handleTypeChange(value)}
                  >
                    <SelectTrigger 
                      id="edit-branchType"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <SelectValue placeholder="Select branch type" />
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

                <div className="space-y-2">
                  <Label htmlFor="edit-branchStat" className="text-sm text-gray-500">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.branchStat}
                    onValueChange={(value: BranchStat) => handleStatusChange(value)}
                  >
                    <SelectTrigger 
                      id="edit-branchStat"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <SelectValue placeholder="Select status" />
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
              </div>
            </div>

            {/* Footer - Reduced padding */}
            <div className="border-t px-6 py-1"> {/* Changed from py-2 to py-1 (4px) */}
              <div className="flex justify-center items-center gap-3">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
                  disabled={!formData.name.trim() || !formData.nameAm.trim() || !formData.code.trim() || !formData.location.trim()}
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
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};