import { BadgePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../ui/dialog';
import type { AddPeriodDto } from '../../../types/core/period';
import React from 'react';
import { Button } from '../../ui/button';
import toast from 'react-hot-toast';

interface AddPeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPeriod: AddPeriodDto;
  setNewPeriod: (period: AddPeriodDto) => void;
  onAddPeriod: () => Promise<void>;
  quarters: Array<{ id: string; name: string }>;
  fiscalYears: Array<{ id: string; name: string }>;
}

// UUID placeholder constant
const PLACEHOLDER_UUID = '00000000-0000-0000-0000-000000000000';

export const AddPeriodModal = ({
  open,
  onOpenChange,
  newPeriod,
  setNewPeriod,
  onAddPeriod,
  quarters,
  fiscalYears
}: AddPeriodModalProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation to check for placeholder UUIDs
    if (!newPeriod.name || !newPeriod.dateStart || !newPeriod.dateEnd) {
      toast.error('Please fill all required fields');
      return;
    }

    if (newPeriod.quarterId === PLACEHOLDER_UUID || newPeriod.fiscalYearId === PLACEHOLDER_UUID) {
      toast.error('Please select a quarter and fiscal year');
      return;
    }

    // Date validation
    const startDate = new Date(newPeriod.dateStart);
    const endDate = new Date(newPeriod.dateEnd);
    
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    if (startDate < new Date()) {
      toast.error('Start date cannot be in the past');
      return;
    }

    try {
      // Remove any existing toasts and show loading
      toast.dismiss();
      toast.loading('Adding period...');
      
      await onAddPeriod();
      
      toast.dismiss();
      toast.success('Period added successfully!');
      
      // Reset form with proper UUID placeholders
      setNewPeriod({
        name: '',
        dateStart: new Date().toISOString(),
        dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: '0',
        quarterId: PLACEHOLDER_UUID,
        fiscalYearId: PLACEHOLDER_UUID
      });
      
      onOpenChange(false);
      
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to add period');
      console.error('Error adding period:', error);
    }
  };

  const handleCancel = () => {
    setNewPeriod({
      name: '',
      dateStart: new Date().toISOString(),
      dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: '0',
      quarterId: PLACEHOLDER_UUID,
      fiscalYearId: PLACEHOLDER_UUID
    });
    onOpenChange(false);
  };

  // Check if current values are placeholders to show proper dropdown state
  const isQuarterSelected = newPeriod.quarterId !== PLACEHOLDER_UUID;
  const isFiscalYearSelected = newPeriod.fiscalYearId !== PLACEHOLDER_UUID;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className='border-b pb-3'>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
            <BadgePlus size={20} className="text-emerald-600" />
            Add New Period
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Period Name - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="periodName" className="block text-sm font-medium text-gray-700 mb-2">
                Period Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="periodName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="e.g., January 2024, Q1 Review"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                required
              />
            </div>

            {/* Quarter Selection */}
            <div>
              <label htmlFor="quarterId" className="block text-sm font-medium text-gray-700 mb-2">
                Quarter <span className="text-red-500">*</span>
              </label>
              <select
                id="quarterId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={isQuarterSelected ? newPeriod.quarterId : ''}
                onChange={(e) => setNewPeriod({ 
                  ...newPeriod, 
                  quarterId: e.target.value || PLACEHOLDER_UUID 
                })}
                required
              >
                <option value="">Select a Quarter</option>
                {quarters.map((quarter) => (
                  <option key={quarter.id} value={quarter.id}>
                    {quarter.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fiscal Year Selection */}
            <div>
              <label htmlFor="fiscalYearId" className="block text-sm font-medium text-gray-700 mb-2">
                Fiscal Year <span className="text-red-500">*</span>
              </label>
              <select
                id="fiscalYearId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={isFiscalYearSelected ? newPeriod.fiscalYearId : ''}
                onChange={(e) => setNewPeriod({ 
                  ...newPeriod, 
                  fiscalYearId: e.target.value || PLACEHOLDER_UUID 
                })}
                required
              >
                <option value="">Select a Fiscal Year</option>
                {fiscalYears.map((fiscalYear) => (
                  <option key={fiscalYear.id} value={fiscalYear.id}>
                    {fiscalYear.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="isActive"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={newPeriod.isActive}
                onChange={(e) => setNewPeriod({ ...newPeriod, isActive: e.target.value })}
              >
                <option value="0">Active</option>
                <option value="1">Inactive</option>
              </select>
            </div>

            {/* Empty spacer for grid alignment */}
            <div></div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={newPeriod.dateStart ? newPeriod.dateStart.split('T')[0] : ''}
                onChange={(e) => setNewPeriod({ 
                  ...newPeriod, 
                  dateStart: e.target.value ? new Date(e.target.value).toISOString() : '' 
                })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={newPeriod.dateEnd ? newPeriod.dateEnd.split('T')[0] : ''}
                onChange={(e) => setNewPeriod({ 
                  ...newPeriod, 
                  dateEnd: e.target.value ? new Date(e.target.value).toISOString() : '' 
                })}
                min={newPeriod.dateStart ? new Date(newPeriod.dateStart).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row-reverse justify-center items-center gap-3 mt-6 border-t pt-4">
            <Button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white cursor-pointer transition-colors"
            >
              Add Period
            </Button>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-50"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};