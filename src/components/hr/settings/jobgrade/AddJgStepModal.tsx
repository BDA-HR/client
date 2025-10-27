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
  const [touched, setTouched] = useState({
    name: false,
    salary: false
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        salary: 0,
        jobGradeId: jobGradeId,
      });
      setSalaryError('');
      setTouched({ name: false, salary: false });
    }
  }, [isOpen, jobGradeId]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'salary') {
      const salaryValue = value === '' ? 0 : Number(value);
      setFormData(prev => ({ ...prev, [name]: salaryValue }));
      
      // Validate salary range only if value is not empty
      if (value !== '') {
        validateSalary(salaryValue);
      } else {
        setSalaryError('');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateSalary = (salaryValue: number) => {
    if (salaryValue < minSalary) {
      setSalaryError(`Salary cannot be less than ${formatCurrency(minSalary)}`);
    } else if (salaryValue > maxSalary) {
      setSalaryError(`Salary cannot exceed ${formatCurrency(maxSalary)}`);
    } else {
      setSalaryError('');
    }
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({ name: true, salary: true });

    // Final validation before submission
    if (!formData.name.trim()) return;
    
    if (formData.salary <= 0) {
      setSalaryError('Salary is required');
      return;
    }

    if (formData.salary < minSalary || formData.salary > maxSalary) {
      setSalaryError(`Salary must be between ${formatCurrency(minSalary)} and ${formatCurrency(maxSalary)}`);
      return;
    }

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

  // Form validation
  const isNameValid = formData.name.trim().length > 0;
  const isSalaryValid = salaryStatus === 'valid';
  const isFormValid = isNameValid && isSalaryValid;

  // Show error only when field is touched
  const showNameError = touched.name && !isNameValid;
  const showSalaryError = touched.salary && salaryError;

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
                onBlur={() => handleBlur('name')}
                placeholder="Eg. Junior Level, Intermediate Level, etc."
                className={`w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent ${
                  showNameError ? 'border-red-300' : ''
                }`}
                required
              />
              {showNameError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Step name is required
                </p>
              )}
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
                  onBlur={() => handleBlur('salary')}
                  placeholder="50000"
                  min={minSalary}
                  max={maxSalary}
                  className={`w-full focus:outline-none focus:ring-1 ${
                    salaryStatus === 'valid' && formData.salary > 0
                      ? 'focus:ring-green-500 border-green-300' 
                      : salaryStatus === 'empty' || formData.salary === 0
                      ? 'focus:ring-green-500'
                      : 'focus:ring-red-500 border-red-300'
                  } focus:border-transparent`}
                  required
                />
                {salaryStatus === 'valid' && formData.salary > 0 && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {(salaryStatus === 'too-low' || salaryStatus === 'too-high') && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              
              {/* Salary Validation Messages */}
              {showSalaryError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {salaryError}
                </p>
              )}
              
              {salaryStatus === 'valid' && formData.salary > 0 && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Salary is within the valid range
                </p>
              )}

              {touched.salary && formData.salary === 0 && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Salary is required
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-2">
          <div className="mx-auto flex justify-center items-center gap-1.5">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-6"
              onClick={handleSubmit}
              disabled={!isFormValid}
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