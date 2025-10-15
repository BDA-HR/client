import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Edit } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import type { PositionListDto, PositionModDto } from '../../../types/hr/position';
import type { UUID } from 'crypto';

interface EditPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (position: PositionModDto) => void;
  position: PositionListDto | null;
}

const EditPositionModal: React.FC<EditPositionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  position
}) => {
  const [formData, setFormData] = useState<PositionModDto>({
    id: '' as UUID,
    name: '',
    nameAm: '',
    noOfPosition: 0,
    isVacant: '1',
    departmentId: '' as UUID,
    rowVersion: ''
  });

  // Initialize form when position changes
  useEffect(() => {
    if (position) {
      setFormData({
        id: position.id,
        name: position.name,
        nameAm: position.nameAm,
        noOfPosition: position.noOfPosition,
        isVacant: position.isVacant,
        departmentId: position.departmentId,
        rowVersion: position.rowVersion || ''
      });
    }
  }, [position]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'noOfPosition' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nameAm.trim() || formData.noOfPosition <= 0) {
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Add escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6 h-screen"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Edit size={20} className="" />
            <h2 className="text-lg font-bold text-gray-800">Edit </h2>
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
              {/* Position Name (English) */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-700 font-medium">
                  Position Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Eg. Software Engineer"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Position Name (Amharic) */}
              <div className="space-y-2">
                <Label htmlFor="nameAm" className="text-sm text-gray-700 font-medium">
                  Position Name (Amharic) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameAm"
                  name="nameAm"
                  value={formData.nameAm}
                  onChange={handleChange}
                  placeholder="Eg. ሶፍትዌር ኢንጂነር"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Number of Positions and Vacancy Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noOfPosition" className="text-sm text-gray-700 font-medium">
                    Number of Positions <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="noOfPosition"
                    name="noOfPosition"
                    type="number"
                    value={formData.noOfPosition}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    className="w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isVacant" className="text-sm text-gray-700 font-medium">
                    Vacancy Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="isVacant"
                    name="isVacant"
                    value={formData.isVacant}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="1">Vacant</option>
                    <option value="0">Filled</option>
                  </select>
                </div>
              </div>

              {/* Department Selection - COMMENTED OUT */}
              {/*
              <div className="space-y-2">
                <Label htmlFor="departmentId" className="text-sm text-gray-700 font-medium">
                  Department <span className="text-red-500">*</span>
                </Label>
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a department</option>
                </select>
              </div>
              */}

              {/* Position Preview */}
              {(formData.name || formData.nameAm) && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800 font-medium mb-2">Position Preview:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">English Name:</span>
                      <span className="font-semibold">{formData.name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amharic Name:</span>
                      <span className="font-semibold">{formData.nameAm || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Positions:</span>
                      <span className="font-semibold">{formData.noOfPosition}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className={`font-bold ${formData.isVacant === '1' ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.isVacant === '1' ? 'Vacant' : 'Filled'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Original Values for Reference */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-2">Original Values:</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">English Name</p>
                    <p className="font-medium">{position.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amharic Name</p>
                    <p className="font-medium">{position.nameAm}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Number of Positions</p>
                    <p className="font-medium">{position.noOfPosition}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vacancy Status</p>
                    <p className="font-medium">{position.isVacantStr}</p>
                  </div>
                  {/* Original Department - COMMENTED OUT */}
                  {/*
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-medium">{position.department}</p>
                  </div>
                  */}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
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
                disabled={
                  !formData.name.trim() || 
                  !formData.nameAm.trim() || 
                  formData.noOfPosition <= 0
                }
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

export default EditPositionModal;