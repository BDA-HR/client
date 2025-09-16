import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { amharicRegex } from '../../../utils/amharic-regex';
import type { EditBranchDto, BranchListDto } from '../../../types/core/branch';

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branchData: EditBranchDto) => void;
  branch: BranchListDto | null;
}

export const EditBranchModal: React.FC<EditBranchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  branch
}) => {
  const [formData, setFormData] = useState<EditBranchDto>({
    id: '',
    name: '',
    nameAm: '',
    code: '',
    location: '',
    dateOpened: new Date().toISOString().split('T')[0],
    branchType: 'REGULAR',
    branchStat: 'ACTIVE',
    compId: '',
    rowVersion: ''
  });

  const [errors, setErrors] = useState<Partial<EditBranchDto>>({});

  useEffect(() => {
    if (branch) {
      setFormData({
        id: branch.id,
        name: branch.name || '',
        nameAm: branch.nameAm || '',
        code: branch.code || '',
        location: branch.location || '',
        dateOpened: branch.dateOpened ? new Date(branch.dateOpened).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        branchType: 'REGULAR', // Default value since it's not in BranchListDto
        branchStat: branch.branchStat || 'ACTIVE',
        compId: '', // This would need to be passed separately or fetched
        rowVersion: branch.rowVersion || ''
      });
    }
  }, [branch]);

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value) || value === '') {
      setFormData(prev => ({ ...prev, nameAm: value }));
    }
  };

  const handleInputChange = (field: keyof EditBranchDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof Partial<EditBranchDto>]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EditBranchDto> = {};

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
        dateOpened: new Date(formData.dateOpened).toISOString()
      };
      
      onSave(submitData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Edit Branch - {branch.name}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name (English) *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter branch name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Amharic Name */}
            <div>
              <label htmlFor="nameAm" className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name (Amharic)
              </label>
              <Input
                id="nameAm"
                type="text"
                placeholder="የምዝግብ ስም አስገባ"
                value={formData.nameAm}
                onChange={handleAmharicChange}
                className="w-full"
              />
            </div>

            {/* Branch Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Branch Code *
              </label>
              <Input
                id="code"
                type="text"
                placeholder="Enter branch code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className="w-full"
                required
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <Input
                id="location"
                type="text"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full"
                required
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Date Opened */}
            <div>
              <label htmlFor="dateOpened" className="block text-sm font-medium text-gray-700 mb-1">
                Date Opened *
              </label>
              <Input
                id="dateOpened"
                type="date"
                value={formData.dateOpened}
                onChange={(e) => handleInputChange('dateOpened', e.target.value)}
                className="w-full"
                required
              />
              {errors.dateOpened && <p className="text-red-500 text-sm mt-1">{errors.dateOpened}</p>}
            </div>

            {/* Branch Status */}
            <div>
              <label htmlFor="branchStat" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <Select
                value={formData.branchStat}
                onValueChange={(value) => handleInputChange('branchStat', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Branch Type */}
            <div>
              <label htmlFor="branchType" className="block text-sm font-medium text-gray-700 mb-1">
                Branch Type *
              </label>
              <Select
                value={formData.branchType}
                onValueChange={(value) => handleInputChange('branchType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="MAIN">Main</SelectItem>
                  <SelectItem value="SUB">Sub-branch</SelectItem>
                  <SelectItem value="MOBILE">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};