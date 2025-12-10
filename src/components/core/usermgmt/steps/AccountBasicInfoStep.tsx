import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';

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

// Validation schema
const validationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string()
    .required('Role is required'),
  modules: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one module')
    .required('Modules are required'),
});

export const AccountBasicInfoStep: React.FC<AccountBasicInfoStepProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
  employee,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    password: initialData.password,
    confirmPassword: initialData.confirmPassword,
    role: initialData.role,
    modules: initialData.modules,
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

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-500">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter password"
                    className={`w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                      errors.password && touched.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
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
                <ErrorMessage name="password">
                  {msg => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                </ErrorMessage>
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm text-gray-500">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm password"
                    className={`w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent ${
                      errors.confirmPassword && touched.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
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
                <ErrorMessage name="confirmPassword">
                  {msg => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm text-gray-500">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.role}
                  onValueChange={(value) => setFieldValue('role', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={`w-full focus:ring-1 focus:ring-emerald-500 ${
                    errors.role && touched.role ? 'border-red-300' : ''
                  }`}>
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
                {errors.role && touched.role && (
                  <div className="text-red-500 text-xs mt-1">{errors.role}</div>
                )}
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
                      checked={values.modules.includes(module.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFieldValue('modules', [...values.modules, module.id]);
                        } else {
                          setFieldValue('modules', values.modules.filter(id => id !== module.id));
                        }
                      }}
                      disabled={isLoading}
                      className="data-[state=checked]:bg-emerald-600 data-[state=changed]:bg-emerald-600 data-[state=checked]:text-white data-[state=checked]:border-emerald-600 h-5 w-5"
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
              {errors.modules && touched.modules && (
                <div className="text-red-500 text-xs mt-1">{errors.modules}</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isLoading || isSubmitting}
                className="px-8"
              >
                {employee ? 'Cancel' : 'Back'}
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                disabled={isLoading || isSubmitting || !isValid}
              >
                {isLoading || isSubmitting ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};