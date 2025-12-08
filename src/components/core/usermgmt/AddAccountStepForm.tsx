import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Lock, Shield, Key, CheckCircle } from 'lucide-react';
import { AccountBasicInfoStep } from './steps/AccountBasicInfoStep';
import { MainPermissionsStep } from './steps/MainPermissionsStep';
import { ApiPermissionsStep } from './steps/ApiPermissionsStep';
import { AddAccountStepHeader } from './AddAccountStepHeader';

const steps = [
  { id: 1, title: 'Basic Info', icon: Lock },
  { id: 2, title: 'Main Permissions', icon: Shield },
  { id: 3, title: 'Detailed Permissions', icon: Key }, // Changed from 'API Permissions'
];

interface AddAccountStepFormProps {
  onBackToAccounts: () => void;
  onAccountAdded: (result: any) => void;
  employee?: {
    id: string;
    name: string;
    employeeCode: string;
    email: string;
  };
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

  // Mock data for detailed permissions - UPDATED to match ApiPermissionsStep props
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
      action: action, // Changed from 'endpoint'
      resource: resource, // Changed from 'method'
      description: `Allows ${action} access to ${resource}`
    };
  });

  // Mock data for main permissions list (for display names)
  const MOCK_MAIN_PERMISSIONS_LIST = Array.from({ length: 50 }, (_, i) => ({
    id: `perm_${i + 1}`,
    name: `Main Permission ${i + 1}`,
    description: `Description for main permission ${i + 1}`
  }));

  // Filter permissions based on selected modules
  const getFilteredPermissions = () => {
    if (formData.step1.modules.length === 0) return [];
    return MOCK_PERMISSIONS.filter(permission =>
      formData.step1.modules.includes(permission.module)
    );
  };

  // Filter detailed permissions based on selected main permissions
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
        email: employee?.email || '',
        password: formData.step1.password,
        role: formData.step1.role,
        modules: formData.step1.modules,
        permissions: formData.step2.permissions,
        apiPermissions: step3Data.apiPermissions,
      };

      console.log('Submitting account data:', finalData);
      
      // Replace with actual API call
      // const result = await accountService.createAccount(finalData);
      const result = { 
        success: true, 
        message: 'Account created successfully',
        accountId: `ACC-${Date.now()}`
      };

      // Clear all temporary data after successful submission
      clearTemporaryData();

      // Call the parent callback with the result
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
      // When going back from step 1, clear temporary data if user wants to start fresh
      clearTemporaryData();
      onBackToAccounts();
    }
  };

  // Load saved form data on component mount
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

      {/* Employee Info Banner */}
      {employee && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Creating Account for Employee</h3>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-gray-600">{employee.name}</p>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    Code: {employee.employeeCode}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {employee.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Step {currentStep} of 3</p>
            </div>
          </div>
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
              employee={employee}
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