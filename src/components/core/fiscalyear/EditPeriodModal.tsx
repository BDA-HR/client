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
import type { EditPeriodDto, PeriodListDto, UUID } from '../../../types/core/period';

interface EditPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (periodData: EditPeriodDto) => void;
  period: PeriodListDto | null;
  quarters: { id: UUID; name: string }[];
  fiscalYears: { id: UUID; name: string }[];
}

interface FormErrors {
  name?: string;
  dateStart?: string;
  dateEnd?: string;
  isActive?: string;
  quarterId?: string;
  fiscalYearId?: string;
}

export const EditPeriodModal: React.FC<EditPeriodModalProps> = ({
  isOpen,
  onClose,
  onSave,
  period,
  quarters,
  fiscalYears,
}) => {
  const [formData, setFormData] = useState<EditPeriodDto>({
    id: '' as UUID,
    name: '',
    dateStart: new Date().toISOString(),
    dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: 'Yes',
    quarterId: '' as UUID,
    fiscalYearId: '' as UUID,
    rowVersion: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (period) {
      setFormData({
        id: period.id,
        name: period.name || '',
        dateStart: period.dateStart,
        dateEnd: period.dateEnd,
        isActive: period.isActive || 'Yes',
        quarterId: '' as UUID, // You'll need to map quarter name to ID or get from API
        fiscalYearId: '' as UUID, // You'll need to map fiscal year to ID or get from API
        rowVersion: period.rowVersion || '',
      });
    }
  }, [period]);

  const handleInputChange = (field: keyof EditPeriodDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Period name is required';
    }
    
    if (!formData.dateStart) {
      newErrors.dateStart = 'Start date is required';
    }
    
    if (!formData.dateEnd) {
      newErrors.dateEnd = 'End date is required';
    }

    if (!formData.quarterId) {
      newErrors.quarterId = 'Quarter is required';
    }

    if (!formData.fiscalYearId) {
      newErrors.fiscalYearId = 'Fiscal year is required';
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
      const submitData: EditPeriodDto = {
        ...formData,
        dateStart: new Date(formData.dateStart).toISOString(),
        dateEnd: new Date(formData.dateEnd).toISOString(),
      };
      onSave(submitData);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const formatDateForInput = (dateString: string): string => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
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
            Edit Period
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodName" className="text-base font-medium">
                Period Name
              </Label>
              <Input
                id="periodName"
                type="text"
                placeholder="e.g., January 2024"
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
                  value={formatDateForInput(formData.dateStart)}
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
                  value={formatDateForInput(formData.dateEnd)}
                  onChange={(e) => handleInputChange('dateEnd', e.target.value)}
                  required
                  className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                />
                {errors.dateEnd && <p className="text-red-500 text-sm">{errors.dateEnd}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quarter" className="text-base font-medium">
                  Quarter
                </Label>
                <Select
                  value={formData.quarterId}
                  onValueChange={(value) => handleInputChange('quarterId', value)}
                >
                  <SelectTrigger className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                    <SelectValue placeholder="Select quarter" />
                  </SelectTrigger>
                  <SelectContent>
                    {quarters.map((quarter) => (
                      <SelectItem key={quarter.id} value={quarter.id}>
                        {quarter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.quarterId && <p className="text-red-500 text-sm">{errors.quarterId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalYear" className="text-base font-medium">
                  Fiscal Year
                </Label>
                <Select
                  value={formData.fiscalYearId}
                  onValueChange={(value) => handleInputChange('fiscalYearId', value)}
                >
                  <SelectTrigger className="w-full h-12 text-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent">
                    <SelectValue placeholder="Select fiscal year" />
                  </SelectTrigger>
                  <SelectContent>
                    {fiscalYears.map((fiscalYear) => (
                      <SelectItem key={fiscalYear.id} value={fiscalYear.id}>
                        {fiscalYear.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fiscalYearId && <p className="text-red-500 text-sm">{errors.fiscalYearId}</p>}
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
              disabled={!formData.name.trim() || !formData.dateStart || !formData.dateEnd || !formData.quarterId || !formData.fiscalYearId}
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