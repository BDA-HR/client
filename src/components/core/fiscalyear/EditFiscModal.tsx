import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import type { EditFiscYearDto, FiscYearListDto, UUID } from '../../../types/core/fisc';

interface EditFiscModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fiscalYearData: EditFiscYearDto) => void;
  fiscalYear: FiscYearListDto | null;
}

interface FormErrors {
  name?: string;
  dateStart?: string;
  dateEnd?: string;
  isActive?: string;
}

export const EditFiscModal: React.FC<EditFiscModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fiscalYear,
}) => {
  const [formData, setFormData] = useState<EditFiscYearDto>({
    id: '' as UUID,
    name: '',
    dateStart: '',
    dateEnd: '',
    isActive: '0', // Default to "0" (Yes/Active)
    rowVersion: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (fiscalYear) {
      const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        id: fiscalYear.id,
        name: fiscalYear.name || '',
        dateStart: formatDateForInput(fiscalYear.dateStart),
        dateEnd: formatDateForInput(fiscalYear.dateEnd),
        isActive: fiscalYear.isActive || '0',
        rowVersion: fiscalYear.rowVersion || '',
      });
    }
  }, [fiscalYear]);

  const handleInputChange = (field: keyof EditFiscYearDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Fiscal year name is required';
    }
    
    if (!formData.dateStart) {
      newErrors.dateStart = 'Start date is required';
    }
    
    if (!formData.dateEnd) {
      newErrors.dateEnd = 'End date is required';
    }
    
    if (formData.dateStart && formData.dateEnd) {
      const startDate = new Date(formData.dateStart);
      const endDate = new Date(formData.dateEnd);
      
      if (endDate <= startDate) {
        newErrors.dateEnd = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData: EditFiscYearDto = {
        ...formData,
        dateStart: formData.dateStart,
        dateEnd: formData.dateEnd,
      };
      onSave(submitData);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
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

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Fiscal Year Name */}
              <div className="space-y-2">
                <Label htmlFor="fiscalYearName" className="text-sm text-gray-500">
                  Fiscal Year Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fiscalYearName"
                  type="text"
                  placeholder="e.g., FY 2025"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm text-gray-500">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.dateStart}
                    onChange={(e) => handleInputChange('dateStart', e.target.value)}
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.dateStart && <p className="text-red-500 text-sm">{errors.dateStart}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm text-gray-500">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.dateEnd}
                    onChange={(e) => handleInputChange('dateEnd', e.target.value)}
                    className="w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.dateEnd && <p className="text-red-500 text-sm">{errors.dateEnd}</p>}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-base font-medium">
                  Status
                </Label>
                <Select
                  value={formData.isActive}
                  onValueChange={(value) => handleInputChange('isActive', value)}
                >
                  <SelectTrigger className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Active</SelectItem>
                    <SelectItem value="1">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.isActive && <p className="text-red-500 text-sm">{errors.isActive}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4">
              <div className="flex justify-center items-center gap-3">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
                  disabled={!formData.name.trim() || !formData.dateStart || !formData.dateEnd}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="cursor-pointer px-6"
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