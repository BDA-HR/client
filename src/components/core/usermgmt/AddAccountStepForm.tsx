import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Lock, Shield, Key } from 'lucide-react';
import { AccountBasicInfoStep } from './steps/AccountBasicInfoStep';
import { MainPermissionsStep } from './steps/MainPermissionsStep';
import { ApiPermissionsStep } from './steps/ApiPermissionsStep';
import { AddAccountStepHeader } from './AddAccountStepHeader';
import type { EmpSearchRes } from '../../../types/core/EmpSearchRes';

const steps = [
  { id: 1, title: 'Basic Info', icon: Lock },
  { id: 2, title: 'Menu Permissions', icon: Shield },
  { id: 3, title: 'Detailed Permissions', icon: Key },
];

interface AddAccountStepFormProps {
  onBackToAccounts: () => void;
  onAccountAdded: (result: any) => void;
  employee?: EmpSearchRes;
}

export const AddAccountStepForm: React.FC<AddAccountStepFormProps> = ({
  onBackToAccounts,
  onAccountAdded,
  employee,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: {
      password: '',
      confirmPassword: '',
      role: '',
      modules: [] as string[],
    },
    step2: {
      permissions: [] as string[],
    },
    step3: {
      apiPermissions: [] as string[],
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for main permissions
  const MOCK_PERMISSIONS = Array.from({ length: 50 }, (_, i) => ({
    id: `perm_${i + 1}`,
    name: `Permission ${i + 1}`,
    module: ['core', 'hr', 'crm', 'file', 'finance', 'procurement', 'inventory'][
      Math.floor(Math.random() * 7)
    ],
    description: `Description for permission ${i + 1}`,
  }));

  // Mock data for detailed permissions
  const MOCK_DETAILED_PERMISSIONS = Array.from({ length: 30 }, (_, i) => {
    const actions = ['view', 'create', 'edit', 'delete', 'approve', 'export'];
    const resources = ['accounts', 'users', 'inventory', 'finance', 'reports', 'files', 'settings'];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const permissionName = `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`;
    
    return {
      id: `detailed_perm_${i + 1}`,
      name: permissionName,
      mainPermissionId: `perm_${Math.floor(Math.random() * 50) + 1}`,
      action: action,
      resource: resource,
      description: `Allows ${action} access to ${resource}`
    };
  });

  // Mock data for main permissions list
  const MOCK_MAIN_PERMISSIONS_LIST = Array.from({ length: 50 }, (_, i) => ({
    id: `perm_${i + 1}`,
    name: `Menu Permission ${i + 1}`,
    description: `Description for menu permission ${i + 1}`
  }));

  const getEmployeeEmail = () => {
    if (!employee) return '';
    
    if (employee.code) {
      if (employee.code.includes('@')) {
        return employee.code;
      }
      return `${employee.code.toLowerCase()}@company.com`;
    }
    
    return '';
  };

  const getEmployeeDisplayName = () => {
    if (!employee) return '';
    return employee.fullName || '';
  };

  const getEmployeeCode = () => {
    if (!employee) return '';
    return employee.code || '';
  };

  const getFilteredPermissions = () => {
    if (formData.step1.modules.length === 0) return [];
    return MOCK_PERMISSIONS.filter(permission =>
      formData.step1.modules.includes(permission.module)
    );
  };

  const getFilteredDetailedPermissions = () => {
    if (formData.step2.permissions.length === 0) return [];
    return MOCK_DETAILED_PERMISSIONS.filter(permission =>
      formData.step2.permissions.includes(permission.mainPermissionId)
    );
  };

  // Scroll to top when step changes
  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all temporary data
  const clearTemporaryData = () => {
    localStorage.removeItem('accountFormData');
    setFormData({
      step1: {
        password: '',
        confirmPassword: '',
        role: '',
        modules: [],
      },
      step2: {
        permissions: [],
      },
      step3: {
        apiPermissions: [],
      },
    });
    setCurrentStep(1);
  };

  // Handle Step 1 submission
  const handleStep1Submit = async (step1Data: any) => {
    setLoading(true);
    setError(null);

    try {
      const updatedFormData = {
        ...formData,
        step1: step1Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('accountFormData', JSON.stringify(updatedFormData));

      scrollToTop();
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save basic info:', error);
      setError('Failed to save basic information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 submission
  const handleStep2Submit = async (step2Data: any) => {
    if (formData.step1.modules.length === 0) {
      setError('Please select at least one module in Step 1 first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedFormData = {
        ...formData,
        step2: step2Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('accountFormData', JSON.stringify(updatedFormData));

      scrollToTop();
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save permissions:', error);
      setError('Failed to save permissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 submission
    const handleStep3Submit = async (step3Data: any) => {
    if (formData.step2.permissions.length === 0) {
      setError('Please select at least one permission in Step 2 first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalData = {
        employeeId: employee?.id || '',
        employeeCode: getEmployeeCode(),
        employeeName: getEmployeeDisplayName(),
        email: getEmployeeEmail(),
        password: formData.step1.password,
        role: formData.step1.role,
        modules: formData.step1.modules,
        permissions: formData.step2.permissions,
        detailedPermissions: step3Data.apiPermissions,
      };

      console.log('Submitting account data:', finalData);
      
      // Replace with actual API call
      
      const result = { 
        success: true, 
        message: 'Account created successfully',
        accountId: `ACC-${Date.now()}`
      };

      clearTemporaryData();

      onAccountAdded(result);
      
    } catch (error) {
      console.error('Failed to create account:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    scrollToTop();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      clearTemporaryData();
      onBackToAccounts();
    }
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem('accountFormData');

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }

    scrollToTop();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header with steps */}
      <AddAccountStepHeader
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) {
            scrollToTop();
            setCurrentStep(step);
          }
        }}
      />

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <AccountBasicInfoStep
              key="step1"
              initialData={formData.step1}
              onSubmit={handleStep1Submit}
              onBack={handleBack}
              isLoading={loading}
              employee={{
                id: employee?.id || '',
                name: getEmployeeDisplayName(),
                employeeCode: getEmployeeCode(),
                email: getEmployeeEmail(),
              }}
            />
          )}
          
          {currentStep === 2 && (
            <MainPermissionsStep
              key="step2"
              initialData={formData.step2}
              onSubmit={handleStep2Submit}
              onBack={handleBack}
              isLoading={loading}
              permissions={getFilteredPermissions()}
              selectedModules={formData.step1.modules}
            />
          )}
          
          {currentStep === 3 && (
            <ApiPermissionsStep
              key="step3"
              initialData={formData.step3}
              onSubmit={handleStep3Submit}
              onBack={handleBack}
              isLoading={loading}
              apiPermissions={getFilteredDetailedPermissions()}
              selectedPermissions={formData.step2.permissions}
              mainPermissionsList={MOCK_MAIN_PERMISSIONS_LIST}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};