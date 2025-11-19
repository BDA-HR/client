import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, BadgePlus } from 'lucide-react';
import { Button } from '../../../../ui/button';
import { Label } from '../../../../ui/label';
import { Input } from '../../../../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../ui/dropdown-menu';
import type { LeavePolicyAddDto, LeaveTypeOptionDto, UUID} from '../../../../../types/hr/leavepolicy';

interface AddLeavePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeavePolicy: (policy: LeavePolicyAddDto) => void;
  leaveTypeOptions: LeaveTypeOptionDto[];
}

const AddLeavePolicyModal: React.FC<AddLeavePolicyModalProps> = ({
  isOpen,
  onClose,
  onAddLeavePolicy,
  leaveTypeOptions
}) => {
  const [formData, setFormData] = useState<LeavePolicyAddDto>({
    name: '',
    requiresAttachment: false,
    minDurPerReq: 1,
    maxDurPerReq: 30,
    holidaysAsLeave: false,
    leaveTypeId: '' as UUID
  });
  const [isLeaveTypeDropdownOpen, setIsLeaveTypeDropdownOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeOptionDto | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: '',
        requiresAttachment: false,
        minDurPerReq: 1,
        maxDurPerReq: 30,
        holidaysAsLeave: false,
        leaveTypeId: '' as UUID
      });
      setSelectedLeaveType(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleLeaveTypeSelect = (leaveType: LeaveTypeOptionDto) => {
    setSelectedLeaveType(leaveType);
    setFormData(prev => ({ ...prev, leaveTypeId: leaveType.id }));
    setIsLeaveTypeDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.leaveTypeId) return;

    onAddLeavePolicy(formData);
    onClose();
  };

 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <BadgePlus size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">Add New</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6">
            <div className="py-4 space-y-4">
              {/* Policy Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                  Policy Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Eg. Annual Leave Policy 2024"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Leave Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 font-medium">
                  Leave Type <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu open={isLeaveTypeDropdownOpen} onOpenChange={setIsLeaveTypeDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <span className="text-sm">
                        {selectedLeaveType ? selectedLeaveType.name : 'Select a leave type'}
                      </span>
                      <svg
                        className={`h-4 w-4 opacity-50 transition-transform ${
                          isLeaveTypeDropdownOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
                    {leaveTypeOptions.map((leaveType) => (
                      <DropdownMenuItem
                        key={leaveType.id}
                        onClick={() => handleLeaveTypeSelect(leaveType)}
                        className="cursor-pointer text-sm"
                      >
                        {leaveType.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Duration Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDurPerReq" className="text-sm text-gray-700 font-medium">
                    Minimum Duration (Days) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="minDurPerReq"
                      name="minDurPerReq"
                      type="number"
                      value={formData.minDurPerReq}
                      onChange={handleChange}
                      placeholder="1"
                      min="0.5"
                      step="0.5"
                      className="w-full pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDurPerReq" className="text-sm text-gray-700 font-medium">
                    Maximum Duration (Days) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="maxDurPerReq"
                      name="maxDurPerReq"
                      type="number"
                      value={formData.maxDurPerReq}
                      onChange={handleChange}
                      placeholder="30"
                      min={formData.minDurPerReq + 0.5}
                      step="0.5"
                      className="w-full pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Boolean Settings */}
              <div className="grid grid-cols-2 gap-4">
                {/* Requires Attachment */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 font-medium">
                    Requires Attachment
                  </Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="requiresAttachment"
                        checked={formData.requiresAttachment === true}
                        onChange={() => setFormData(prev => ({ ...prev, requiresAttachment: true }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="requiresAttachment"
                        checked={formData.requiresAttachment === false}
                        onChange={() => setFormData(prev => ({ ...prev, requiresAttachment: false }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Holidays as Leave */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 font-medium">
                    Holidays Count as Leave
                  </Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="holidaysAsLeave"
                        checked={formData.holidaysAsLeave === true}
                        onChange={() => setFormData(prev => ({ ...prev, holidaysAsLeave: true }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="holidaysAsLeave"
                        checked={formData.holidaysAsLeave === false}
                        onChange={() => setFormData(prev => ({ ...prev, holidaysAsLeave: false }))}
                        className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
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
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
                type="submit"
                disabled={!formData.name.trim() || !formData.leaveTypeId}
              >
                Create 
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLeavePolicyModal;