import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import type { AddPubHolidayDto } from '../../../types/core/pubHoliday';
import React from 'react';
import toast from 'react-hot-toast';
import { amharicRegex } from '../../../utils/amharic-regex';

export const AddPubHolidayModal = ({
  open,
  onOpenChange,
  newHoliday,
  setNewHoliday,
  onAddPubHoliday
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newHoliday: AddPubHolidayDto;
  setNewHoliday: (holiday: AddPubHolidayDto) => void;
  onAddPubHoliday: () => Promise<void>;
}) => {
  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      const updatedHoliday: AddPubHolidayDto = {
        ...newHoliday,
        nameAm: value
      };
      setNewHoliday(updatedHoliday);
    }
  };

  const handleEnglishNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedHoliday: AddPubHolidayDto = {
      ...newHoliday,
      name: e.target.value
    };
    setNewHoliday(updatedHoliday);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedHoliday: AddPubHolidayDto = {
      ...newHoliday,
      date: e.target.value
    };
    setNewHoliday(updatedHoliday);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newHoliday.name || !newHoliday.nameAm || !newHoliday.date) {
      toast.error('Please fill all required fields');
      return;
    }

    try {      
      // Call the add function
      await onAddPubHoliday();
      
      // Success notification
      toast.success('Public holiday added successfully!');
      
      // Reset form and close modal
      setNewHoliday({
        name: '',
        nameAm: '',
        date: ''
      });
      
      onOpenChange(false);
      
    } catch (error) {
      // Error notification - this will be called if onAddPubHoliday throws an error
      toast.error('Failed to add public holiday');
      console.error('Error adding public holiday:', error);
    }
  };

  const handleCancel = () => {
    // Reset form when canceling
    setNewHoliday({
      name: '',
      nameAm: '',
      date: ''
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
                <h2 className="text-lg font-bold text-gray-800">Add New</h2>
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
                  {/* Holiday Name (Amharic) */}
                  <div className="space-y-2">
                    <Label htmlFor="holidayNameAm" className="block text-sm font-medium text-gray-700">
                      የበዓል ስም (አማርኛ) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="holidayNameAm"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="ምሳሌ፡ አዲስ አመት"
                      value={newHoliday.nameAm}
                      onChange={handleAmharicChange}
                      required
                    />
                  </div>

                  {/* Holiday Name (English) */}
                  <div className="space-y-2">
                    <Label htmlFor="holidayName" className="block text-sm font-medium text-gray-700">
                      Holiday Name (English) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="holidayName"
                      className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., New Year's Day"
                      value={newHoliday.name}
                      onChange={handleEnglishNameChange}
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
                </div>

                {/* footer */}
                <div className="border-t px-6 py-2">
                  <div className="mx-auto flex justify-center items-center gap-1.5">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
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