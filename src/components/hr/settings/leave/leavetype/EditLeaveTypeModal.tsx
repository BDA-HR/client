import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Edit, Calendar } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../ui/dropdown-menu';
import type { LeaveTypeListDto, LeaveTypeModDto, UUID } from '../../../../../types/hr/leavetype';

interface EditLeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leaveType: LeaveTypeModDto) => void;
  leaveType: LeaveTypeListDto | null;
}

const EditLeaveTypeModal: React.FC<EditLeaveTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  leaveType
}) => {
  const [formData, setFormData] = useState<LeaveTypeModDto>({
    id: '' as UUID,
    name: '',
    code: '0',
    isPaid: true,
    rowVersion: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Create a proper close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Initialize form when leaveType changes
  useEffect(() => {
    if (leaveType) {
      setFormData({
        id: leaveType.id,
        name: leaveType.name,
        code: leaveType.code,
        isPaid: leaveType.isPaid,
        rowVersion: leaveType.rowVersion || ''
      });
    }
  }, [leaveType]);

  const handleCategorySelect = (code: string) => {
    setFormData(prev => ({ ...prev, code }));
    setIsDropdownOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }

    onSave(formData);
    handleClose();
  };

  const getCategoryDisplayName = (code: string) => {
    return code === '0' ? 'Annual Leave' : 'Sick Leave';
  };

  


  // Add escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen || !leaveType) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Edit size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">Edit </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6">
            <div className="py-4 space-y-4">
              {/* Leave Type Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                  Leave Type Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Eg. Annual Leave, Sick Leave, Unpaid Leave"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Leave Type Category Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 font-medium">
                  Leave Category <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <span className="text-sm">{getCategoryDisplayName(formData.code)}</span>
                      <svg
                        className={`h-4 w-4 opacity-50 transition-transform ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
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
                <Label className="text-sm text-gray-700 font-medium">
                  Payment Status <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Paid Leave Option */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPaid: true }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                      formData.isPaid === true
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      formData.isPaid === true ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm">Paid Leave</span>
                    <span className="text-xs opacity-75">Employee receives pay</span>
                  </button>

                  {/* Unpaid Leave Option */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPaid: false }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                      formData.isPaid === false
                        ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      formData.isPaid === false ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm">Unpaid Leave</span>
                    <span className="text-xs opacity-75">No payment during leave</span>
                  </button>
                </div>

              </div>
              
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 rounded-b-xl">
            <div className="flex flex-row-reverse justify-center items-center gap-3">
              <Button
                variant="outline"
                className="cursor-pointer px-6 border-gray-300 hover:bg-gray-100"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                type="submit"
                disabled={!formData.name.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditLeaveTypeModal;