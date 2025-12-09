import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';
import toast from 'react-hot-toast';

interface AccountBasicInfoStepProps {
  initialData: {
    password: string;
    confirmPassword: string;
    role: string;
    modules: string[];
  };
  onSubmit: (data: any) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  employee?: {
    id: string;
    name: string;
    employeeCode: string;
    email: string;
  };
}

const MODULE_OPTIONS = [
  { id: 'hr', label: 'HR' },
  { id: 'crm', label: 'CRM' },
  { id: 'file', label: 'File Management' },
  { id: 'finance', label: 'Finance' },
  { id: 'procurement', label: 'Procurement' },
  { id: 'inventory', label: 'Inventory' },
];

export const AccountBasicInfoStep: React.FC<AccountBasicInfoStepProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
  employee,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleModuleChange = (moduleId: string) => {
    setFormData(prev => {
      if (prev.modules.includes(moduleId)) {
        return {
          ...prev,
          modules: prev.modules.filter(id => id !== moduleId)
        };
      } else {
        return {
          ...prev,
          modules: [...prev.modules, moduleId]
        };
      }
    });
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.role) {
      toast.error('Please select a role');
      return false;
    }
    if (formData.modules.length === 0) {
      toast.error('Please select at least one module');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit(formData);
  };

  const isFormValid = () => {
    return (
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      formData.role &&
      formData.modules.length > 0
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Account Basic Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-gray-500">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                placeholder="Enter password"
                className="w-full pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm text-gray-500">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Confirm password"
                className="w-full pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm text-gray-500">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, role: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full focus:ring-1 focus:ring-emerald-500">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="user">Regular User</SelectItem>
                <SelectItem value="viewer">Viewer Only</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Modules Selection */}
        <div className="space-y-4">
          <Label className="text-sm text-gray-500 flex items-center gap-2">
            <Shield size={14} />
            Modules Access <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODULE_OPTIONS.map((module) => (
              <div key={module.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`module-${module.id}`}
                  checked={formData.modules.includes(module.id)}
                  onCheckedChange={() => handleModuleChange(module.id)}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white data-[state=checked]:border-emerald-600 h-5 w-5"
                />
                <label
                  htmlFor={`module-${module.id}`}
                  className="text-sm text-gray-700 cursor-pointer font-medium"
                >
                  {module.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-8 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="px-8"
          >
            {employee ? 'Cancel' : 'Back'}
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};