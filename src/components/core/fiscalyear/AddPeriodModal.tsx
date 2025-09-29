import { BadgePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../ui/dialog';
import type { AddPeriodDto, UUID } from '../../../types/core/period';
import React from 'react';
import { Button } from '../../ui/button';
import toast from 'react-hot-toast';
import { PeriodStat } from '../../../types/core/enum';

interface AddPeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPeriod: AddPeriodDto;
  setNewPeriod: (period: AddPeriodDto) => void;
  onAddPeriod: () => Promise<void>;
}

export const AddPeriodModal = ({
  open,
  onOpenChange,
  newPeriod,
  setNewPeriod,
  onAddPeriod
}: AddPeriodModalProps) => {
  const [loading, setLoading] = React.useState(false);

  // Create options from PeriodStat enum
  const periodStatusOptions = Object.entries(PeriodStat); // [["0", "Active"], ["1", "Inactive"]]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPeriod.name || !newPeriod.dateStart || !newPeriod.dateEnd) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!newPeriod.quarterId || !newPeriod.fiscalYearId) {
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

    try {
      setLoading(true);
      await onAddPeriod();
    } catch (error) {
      console.error('Error adding period:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewPeriod({
      name: '',
      dateStart: '',
      dateEnd: '',
      isActive: PeriodStat["0"], // Default to 'Active' using enum
      quarterId: '' as UUID,
      fiscalYearId: '' as UUID
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className='border-b pb-3'>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
            <BadgePlus size={18} />
            Add New
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
                Quarter ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="quarterId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter quarter ID"
                value={newPeriod.quarterId}
                onChange={(e) => setNewPeriod({ ...newPeriod, quarterId: e.target.value as UUID })}
                required
              />
            </div>

            {/* Fiscal Year Selection */}
            <div>
              <label htmlFor="fiscalYearId" className="block text-sm font-medium text-gray-700 mb-2">
                Fiscal Year ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fiscalYearId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Enter fiscal year ID"
                value={newPeriod.fiscalYearId}
                onChange={(e) => setNewPeriod({ ...newPeriod, fiscalYearId: e.target.value as UUID })}
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={newPeriod.dateStart ? newPeriod.dateStart.split('T')[0] : newPeriod.dateStart}
                onChange={(e) => setNewPeriod({ ...newPeriod, dateStart: e.target.value })}
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
                value={newPeriod.dateEnd ? newPeriod.dateEnd.split('T')[0] : newPeriod.dateEnd}
                onChange={(e) => setNewPeriod({ ...newPeriod, dateEnd: e.target.value })}
                required
              />
            </div>

            {/* Status - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="isActive"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                value={newPeriod.isActive}
                onChange={(e) => setNewPeriod({ ...newPeriod, isActive: e.target.value })}
              >
                {periodStatusOptions.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row justify-center items-center gap-3 mt-6 border-t pt-4">
            <Button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white cursor-pointer transition-colors"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Save'}
            </Button>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-50"
                onClick={handleCancel}
                disabled={loading}
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