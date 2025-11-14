import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { AddHolidayDto } from '../../../types/core/holiday';
import React from 'react';
import toast from 'react-hot-toast';

interface AddHolidayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newHoliday: AddHolidayDto;
  setNewHoliday: (holiday: AddHolidayDto) => void;
  onAddHoliday: () => Promise<void>;
  fiscalYears: Array<{ id: string; name: string }>; // Add fiscal years prop
}

export const AddHolidayModal = ({
  open,
  onOpenChange,
  newHoliday,
  setNewHoliday,
  onAddHoliday,
  fiscalYears = [] // Default to empty array
}: AddHolidayModalProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedHoliday: AddHolidayDto = {
      ...newHoliday,
      name: e.target.value
    };
    setNewHoliday(updatedHoliday);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedHoliday: AddHolidayDto = {
      ...newHoliday,
      date: e.target.value
    };
    setNewHoliday(updatedHoliday);
  };

  const handleFiscalYearChange = (value: string) => {
    const updatedHoliday: AddHolidayDto = {
      ...newHoliday,
      fiscalYearId: value
    };
    setNewHoliday(updatedHoliday);
  };

  const handleIsPublicChange = (isPublic: boolean) => {
    const updatedHoliday: AddHolidayDto = {
      ...newHoliday,
      isPublic
    };
    setNewHoliday(updatedHoliday);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newHoliday.name || !newHoliday.date || !newHoliday.fiscalYearId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {      
      // Call the add function
      await onAddHoliday();
      
      // Success notification
      toast.success('Holiday added successfully!');
      
      // Reset form and close modal
      setNewHoliday({
        name: '',
        date: '',
        isPublic: true,
        fiscalYearId: '' // Reset fiscal year ID
      });
      
      onOpenChange(false);
      
    } catch (error) {
      // Error notification - this will be called if onAddHoliday throws an error
      toast.error('Failed to add holiday');
      console.error('Error adding holiday:', error);
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setNewHoliday({
      name: '',
      date: '',
      isPublic: true,
      fiscalYearId: ''
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
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
            className="bg-white rounded-xl shadow-xl max-w-2xl w-1/3 max-h-[90vh] overflow-y-auto"
          >
            {/* header */}
            <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <BadgePlus size={20} />
                <h2 className="text-lg font-bold text-gray-800">Add New </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* body */}
            <div className="px-6">
              <form onSubmit={handleSubmit}>
                <div className="py-4 space-y-3">
                  {/* Holiday Name */}
                  <div className="space-y-2">
                    <Label htmlFor="holidayName" className="block text-sm font-medium text-gray-700">
                      Holiday Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="holidayName"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., New Year's Day"
                      value={newHoliday.name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>

                  {/* Holiday Date */}
                  <div className="space-y-2">
                    <Label htmlFor="holidayDate" className="block text-sm font-medium text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      id="holidayDate"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      value={newHoliday.date ? newHoliday.date.split('T')[0] : newHoliday.date}
                      onChange={handleDateChange}
                      required
                    />
                  </div>

                  {/* Fiscal Year */}
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear" className="block text-sm font-medium text-gray-700">
                      Fiscal Year <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newHoliday.fiscalYearId}
                      onValueChange={handleFiscalYearChange}
                    >
                      <SelectTrigger className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent">
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
                  </div>

                  {/* Is Public Switch */}
                  <div className="flex items-center justify-between space-y-2 py-2">
                    <Label htmlFor="isPublic" className="block text-sm font-medium text-gray-700">
                      Public Holiday
                    </Label>
                    <Switch
                      id="isPublic"
                      checked={newHoliday.isPublic}
                      onCheckedChange={handleIsPublicChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500 -mt-2">
                    {newHoliday.isPublic 
                      ? 'This holiday will be visible to all employees' 
                      : 'This holiday will be for specific groups only'
                    }
                  </p>
                </div>

                {/* footer */}
                <div className="border-t px-6 py-2">
                  <div className="mx-auto flex justify-center items-center gap-1.5">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                      disabled={!newHoliday.name || !newHoliday.date || !newHoliday.fiscalYearId}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer px-6"
                      onClick={handleCancel}
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