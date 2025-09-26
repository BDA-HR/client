import { BadgePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../../ui/dialog';
import type { AddFiscYearDto } from '../../../types/core/fisc';
import React from 'react';
import { Button } from '../../ui/button';
import toast from 'react-hot-toast';

export const AddFiscalYearModal = ({
  open,
  onOpenChange,
  newYear,
  setNewYear,
  onAddFiscalYear
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newYear: AddFiscYearDto;
  setNewYear: (year: AddFiscYearDto) => void;
  onAddFiscalYear: () => Promise<void>;
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newYear.name || !newYear.dateStart || !newYear.dateEnd) {
      toast.error('Please fill all required fields');
      return;
    }

    // Date validation
    const startDate = new Date(newYear.dateStart);
    const endDate = new Date(newYear.dateEnd);
    
    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      // Show loading toast
      toast.loading('Adding fiscal year...');
      
      // Call the add function
      await onAddFiscalYear();
      
      // Success notification
      toast.success('Fiscal year added successfully!');
      
      // Reset form and close modal
      setNewYear({
        name: '',
        dateStart: '',
        dateEnd: ''
      });
      
      onOpenChange(false);
      
    } catch (error) {
      // Error notification - this will be called if onAddFiscalYear throws an error
      toast.error('Failed to add fiscal year');
      console.error('Error adding fiscal year:', error);
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setNewYear({
      name: '',
      dateStart: '',
      dateEnd: ''
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl"
      onInteractOutside={(e) => e.preventDefault()} 
      >
        <DialogHeader className='border-b pb-3 flex flex-row justify-between items-center'>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className='flex items-center gap-2'> <BadgePlus size={20} /> Add New</DialogTitle>
              <DialogDescription className='hidden'>
                Fill in the details below to create a new fiscal year period.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mt-4">
            {/* Name */}
            <div>
              <label htmlFor="yearName" className="block text-sm font-medium text-gray-700 mb-1">
                Fiscal Year Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="yearName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., FY 2025"
                value={newYear.name}
                onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Start Date */}
              <div className='space-y-4'>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={newYear.dateStart ? newYear.dateStart.split('T')[0] : newYear.dateStart}
                  onChange={(e) => setNewYear({ 
                    ...newYear, 
                    dateStart: e.target.value
                  })}
                  required
                />
              </div>

              {/* End Date */}
              <div className='space-y-4'>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={newYear.dateEnd ? newYear.dateEnd.split('T')[0] : newYear.dateEnd}
                  onChange={(e) => setNewYear({ 
                    ...newYear, 
                    dateEnd: e.target.value
                  })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row-reverse justify-center items-center gap-3 mt-4 border-t pt-2 pb-0" >
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer px-6"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white cursor-pointer"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};