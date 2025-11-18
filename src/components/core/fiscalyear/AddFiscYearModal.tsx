import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../ui/button';
import type { AddFiscYearDto } from '../../../types/core/fisc';
import React, { useState } from 'react';
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
  onAddFiscalYear: () => Promise<any>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {      
      const response = await onAddFiscalYear();
      
      const successMessage = 
        response?.data?.message || 
        response?.message || 
        '';
      
      toast.success(successMessage);
      
      // Reset form and close modal
      setNewYear({
        name: '',
        dateStart: '',
        dateEnd: ''
      });
      
      onOpenChange(false);
      
    } catch (error: any) {
      const errorMessage = error.message || '';
      toast.error(errorMessage);
      console.error('Error adding fiscal year:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      // Reset form when canceling
      setNewYear({
        name: '',
        dateStart: '',
        dateEnd: ''
      });
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <>
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* header */}
            <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <BadgePlus size={20} />
                <h2 className="text-lg font-bold text-gray-800">Add New</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
            </div>

            {/* body */}
            <div className="px-6">
              <form onSubmit={handleSubmit}>
                <div className="py-4 space-y-3">
                  {/* Fiscal Year Name */}
                  <div className="space-y-2">
                    <label htmlFor="yearName" className="block text-sm font-medium text-gray-700">
                      Fiscal Year Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="yearName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="e.g., FY 2025"
                      value={newYear.name}
                      onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Start and End Dates - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                        value={newYear.dateStart ? newYear.dateStart.split('T')[0] : newYear.dateStart}
                        onChange={(e) => setNewYear({ 
                          ...newYear, 
                          dateStart: e.target.value
                        })}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                        value={newYear.dateEnd ? newYear.dateEnd.split('T')[0] : newYear.dateEnd}
                        onChange={(e) => setNewYear({ 
                          ...newYear, 
                          dateEnd: e.target.value
                        })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div className="border-t px-6 py-2">
                  <div className="mx-auto flex justify-center items-center gap-1.5">
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-6"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer px-6"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};