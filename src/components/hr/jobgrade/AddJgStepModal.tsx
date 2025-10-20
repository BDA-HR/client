import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import type { JgStepAddDto } from '../../../types/hr/JgStep';
import type { UUID } from '../../../types/hr/jobgrade';

interface AddJgStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStep: (step: JgStepAddDto) => void;
  jobGradeId: UUID;
}

const AddJgStepModal: React.FC<AddJgStepModalProps> = ({
  isOpen,
  onClose,
  onAddStep,
  jobGradeId,
}) => {
  const [formData, setFormData] = useState<JgStepAddDto>({
    name: '',
    salary: 0,
    jobGradeId: jobGradeId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'salary' ? Number(value) : value 
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || formData.salary <= 0) return;

    onAddStep({
      ...formData,
      jobGradeId: jobGradeId,
    });

    // Reset form
    setFormData({
      name: '',
      salary: 0,
      jobGradeId: jobGradeId,
    });
    onClose();
  };

  // const formatSalary = (salary: number): string => {
  //   return new Intl.NumberFormat('en-ET', {
  //     style: 'currency',
  //     currency: 'ETB',
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0
  //   }).format(salary);
  // };

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
          <div className="py-4 space-y-3">
            {/* Step Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-500">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Eg. Junior Level, Intermediate Level, etc."
                className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm text-gray-500">
                Salary <span className="text-red-500">*</span>
              </Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary || ''}
                onChange={handleChange}
                placeholder="50000"
                min="0"
                className="w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Salary Preview */}
            {/* {formData.salary > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-800 font-medium mb-2">Salary Preview:</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Step Salary</p>
                    <p className="font-semibold text-green-700 text-lg">
                      {formatSalary(formData.salary)}
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!formData.name.trim() || formData.salary <= 0}
            >
              Save
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer px-6"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddJgStepModal;