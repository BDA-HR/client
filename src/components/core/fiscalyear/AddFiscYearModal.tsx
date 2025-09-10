import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import type { NewFiscalYear } from '../../../types/fiscalYear';
import React from 'react';

export const AddFiscalYearModal = ({
  open,
  onOpenChange,
  newYear,
  setNewYear,
  onAddFiscalYear
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newYear: NewFiscalYear;
  setNewYear: (year: NewFiscalYear) => void;
  onAddFiscalYear: () => void;
}) => {
  const amharicRegex = /^[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\s0-9]*$/;

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value)) {
      setNewYear({ ...newYear, nameAm: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFiscalYear();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl">Add New Fiscal Year</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new fiscal year period.
              </DialogDescription>
            </div>

          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {/* Amharic Name */}
            <div>
              <label htmlFor="yearNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                የበጀት አመት  <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="yearNameAm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="ምሳሌ፡ 2017 ዓ.ም"
                value={newYear.nameAm || ''}
                onChange={handleAmharicChange}
                required
              />
            </div>

            {/* English Name */}
            <div>
              <label htmlFor="yearName" className="block text-sm font-medium text-gray-700 mb-1">
                Fiscal Year  <span className="text-red-500">*</span>
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

            {/* Status */}
            <div>
              <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="isActive"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                value={newYear.isActive}
                onChange={(e) =>
                  setNewYear({ ...newYear, isActive: e.target.value as 'Yes' | 'No' })
                }
              >
                <option value="Yes">Active</option>
                <option value="No">Inactive</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                value={newYear.dateStart}
                onChange={(e) => setNewYear({ ...newYear, dateStart: e.target.value })}
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                value={newYear.dateEnd}
                onChange={(e) => setNewYear({ ...newYear, dateEnd: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} />
              Add Fiscal Year
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
