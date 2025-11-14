import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, PenBox } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import type { EditHolidayDto, HolidayDto, UUID } from '../../../types/core/holiday';

interface EditHolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holidayData: EditHolidayDto) => void;
  holiday: HolidayDto | null;
}

interface FormErrors {
  name?: string;
  date?: string;
}

export const EditHolidayModal: React.FC<EditHolidayModalProps> = ({
  isOpen,
  onClose,
  onSave,
  holiday,
}) => {
  const [formData, setFormData] = useState<EditHolidayDto>({
    id: '' as UUID,
    name: '',
    date: '',
    isPublic: true,
    rowVersion: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (holiday) {
      const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        id: holiday.id,
        name: holiday.name || '',
        date: formatDateForInput(holiday.date),
        isPublic: holiday.isPublic ?? true,
        rowVersion: holiday.rowVersion || '',
      });
    }
  }, [holiday]);

  const handleInputChange = (field: keyof EditHolidayDto, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Holiday name is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.date) {
      const holidayDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (holidayDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData: EditHolidayDto = {
        ...formData,
        date: formData.date,
        name: formData.name,
        isPublic: formData.isPublic,
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-1/3"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <PenBox size={20} />
            <h2 className="text-lg font-bold text-gray-800">Edit </h2>
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
              {/* Holiday Name */}
              <div className="space-y-2">
                <Label htmlFor="holidayName" className="text-sm text-gray-500">
                  Holiday Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="holidayName"
                  type="text"
                  placeholder="e.g., New Year's Day"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="holidayDate" className="text-sm text-gray-500">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="holidayDate"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>

              {/* Is Public Switch */}
              <div className="flex items-center justify-between space-y-2 py-2">
                <Label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Public Holiday
                </Label>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
              </div>
              <p className="text-sm text-gray-500 -mt-2">
                {formData.isPublic 
                  ? 'This holiday will be visible to all employees' 
                  : 'This holiday will be for specific groups only'
                }
              </p>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-2 -mb-4">
              <div className="mx-auto flex justify-center items-center gap-1.5">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                  disabled={!formData.name.trim() || !formData.date}
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