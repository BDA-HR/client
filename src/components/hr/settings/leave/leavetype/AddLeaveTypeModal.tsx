import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus, ChevronDown } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../ui/dropdown-menu';
import type { LeaveTypeAddDto } from '../../../../../types/hr/leavetype';

interface AddLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeaveType: (leaveType: LeaveTypeAddDto) => void;
}

const AddLeaveTypeModal: React.FC<AddLeaveTypeModalProps> = ({
  isOpen,
  onClose,
  onAddLeaveType,
}) => {
  const [formData, setFormData] = useState<LeaveTypeAddDto>({
    name: '',
    code: '0', // Default to '0' (Annual Leave)
    isPaid: true, // Default to paid leave
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (code: string) => {
    setFormData((prev) => ({ ...prev, code }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    onAddLeaveType(formData);

    // Reset form to default values
    setFormData({
      name: '',
      code: '0',
      isPaid: true,
    });
    onClose();
  };

  const getCategoryDisplayName = (code: string) => {
    return code === '0' ? 'Annual Leave' : 'Sick Leave';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} />
            <h2 className="text-lg font-bold text-gray-800">Add New</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6">
          <div className="py-4 space-y-4">
            {/* Leave Type Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-500">
                Leave Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Eg. Annual Leave, Sick Leave, Unpaid Leave"
                className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Leave Type Category Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">
                Leave Category <span className="text-red-500">*</span>
              </Label>
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-gray-300 hover:bg-gray-50 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                  >
                    <span className="text-sm">{getCategoryDisplayName(formData.code)}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                  <DropdownMenuItem
                    onClick={() => handleCategorySelect('0')}
                    className="cursor-pointer text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">Annual Leave</span>
                      <span className="text-xs text-gray-500 mt-1">
                        For vacation and personal time off
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCategorySelect('1')}
                    className="cursor-pointer text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">Sick Leave</span>
                      <span className="text-xs text-gray-500 mt-1">
                        For medical reasons and health-related absences
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Paid Status */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-500">
                Payment Status
              </Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPaid"
                    value="true"
                    checked={formData.isPaid === true}
                    onChange={() => setFormData(prev => ({ ...prev, isPaid: true }))}
                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Paid Leave</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPaid"
                    value="false"
                    checked={formData.isPaid === false}
                    onChange={() => setFormData(prev => ({ ...prev, isPaid: false }))}
                    className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Unpaid Leave</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex justify-center items-center gap-3">
            <Button
              variant="outline"
              className="cursor-pointer px-6 border-gray-300 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6 shadow-sm"
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              Save 
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddLeaveTypeModal;