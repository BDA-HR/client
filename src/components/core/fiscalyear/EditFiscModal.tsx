import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { PenBox } from 'lucide-react';
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
    isActive: 'Yes',
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
        isActive: fiscalYear.isActive || 'Yes',
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
        // Remove the Date conversion - send the string directly
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2">
            <PenBox size={20} />
            Edit Fiscal Year
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYearName" className="text-base font-medium">
                Fiscal Year Name
              </Label>
              <Input
                id="fiscalYearName"
                type="text"
                placeholder="e.g., FY 2025"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-base font-medium">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.dateStart}
                  onChange={(e) => handleInputChange('dateStart', e.target.value)}
                  required
                  className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.dateStart && <p className="text-red-500 text-sm">{errors.dateStart}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-base font-medium">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.dateEnd}
                  onChange={(e) => handleInputChange('dateEnd', e.target.value)}
                  required
                  className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.dateEnd && <p className="text-red-500 text-sm">{errors.dateEnd}</p>}
              </div>
            </div>

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
                  <SelectItem value="Yes">Active</SelectItem>
                  <SelectItem value="No">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.isActive && <p className="text-red-500 text-sm">{errors.isActive}</p>}
            </div>
          </div>

          <div className="flex justify-center items-center gap-1.5 border-t pt-6">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer h-11 px-8 text-base focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              disabled={!formData.name.trim() || !formData.dateStart || !formData.dateEnd}
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