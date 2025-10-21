import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, BadgePlus, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { Input } from '../../../ui/input';
import type { JgStepAddDto } from '../../../../types/hr/JgStep';
import type { UUID } from '../../../../types/hr/jobgrade';

interface AddJgStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStep: (step: JgStepAddDto) => void;
  jobGradeId: UUID;
  minSalary: number;
  maxSalary: number;
}

const AddJgStepModal: React.FC<AddJgStepModalProps> = ({
  isOpen,
  onClose,
  onAddStep,
  jobGradeId,
  minSalary,
  maxSalary,
}) => {
  const [formData, setFormData] = useState<JgStepAddDto>({
    name: '',
    salary: 0,
    jobGradeId: jobGradeId,
  });
  const [salaryError, setSalaryError] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        salary: 0,
        jobGradeId: jobGradeId,
      });
      setSalaryError('');
    }
  }, [isOpen, jobGradeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'salary') {
      const salaryValue = Number(value);
      setFormData(prev => ({ ...prev, [name]: salaryValue }));
      
      // Validate salary range
      if (salaryValue < minSalary) {
        setSalaryError(`Salary cannot be less than ${formatCurrency(minSalary)}`);
      } else if (salaryValue > maxSalary) {
        setSalaryError(`Salary cannot exceed ${formatCurrency(maxSalary)}`);
      } else {
        setSalaryError('');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    // Final validation before submission
    if (formData.salary < minSalary || formData.salary > maxSalary) {
      setSalaryError(`Salary must be between ${formatCurrency(minSalary)} and ${formatCurrency(maxSalary)}`);
      return;
    }

    if (!formData.name.trim() || formData.salary <= 0) return;

    onAddStep({
      ...formData,
      jobGradeId: jobGradeId,
    });

    onClose();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ET', {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSalaryValidationStatus = () => {
    if (!formData.salary || formData.salary === 0) return 'empty';
    if (formData.salary < minSalary) return 'too-low';
    if (formData.salary > maxSalary) return 'too-high';
    return 'valid';
  };

  const salaryStatus = getSalaryValidationStatus();

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
            <h2 className="text-lg font-bold text-gray-800">Add New Job Step</h2>
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
            {/* Step Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-500">
                Step Name <span className="text-red-500">*</span>
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

            {/* Salary Range Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Salary Range</span>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Minimum: <span className="font-semibold">{formatCurrency(minSalary)} ETB</span></div>
                <div>Maximum: <span className="font-semibold">{formatCurrency(maxSalary)} ETB</span></div>
              </div>
            </div>

            {/* Salary Input */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm text-gray-500">
                Step Salary <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary || ''}
                  onChange={handleChange}
                  placeholder="50000"
                  min={minSalary}
                  max={maxSalary}
                  className={`w-full focus:outline-none focus:ring-1 ${
                    salaryStatus === 'valid' 
                      ? 'focus:ring-green-500 border-green-300' 
                      : salaryStatus === 'empty'
                      ? 'focus:ring-green-500'
                      : 'focus:ring-red-500 border-red-300'
                  } focus:border-transparent`}
                  required
                />
                {salaryStatus === 'valid' && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {(salaryStatus === 'too-low' || salaryStatus === 'too-high') && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              
              {/* Salary Validation Messages */}
              {salaryError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {salaryError}
                </p>
              )}
              
              {salaryStatus === 'valid' && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Salary is within the valid range
                </p>
              )}
            </div>

            {/* Salary Preview */}
            {/* {formData.salary > 0 && (
              <div className={`p-3 rounded-lg border ${
                salaryStatus === 'valid' 
                  ? 'bg-green-50 border-green-100' 
                  : 'bg-yellow-50 border-yellow-100'
              }`}>
                <p className="text-sm font-medium mb-2">
                  {salaryStatus === 'valid' ? '✓ Salary Preview:' : '⚠ Salary Preview:'}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Step Salary</p>
                    <p className={`font-semibold text-lg ${
                      salaryStatus === 'valid' ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {formatCurrency(formData.salary)} ETB
                    </p>
                  </div>
                  {salaryStatus === 'valid' && (
                    <div className="text-right">
                      <p className="text-xs text-green-600">✓ Valid</p>
                    </div>
                  )}
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
              disabled={!formData.name.trim() || formData.salary <= 0 || salaryStatus !== 'valid'}
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