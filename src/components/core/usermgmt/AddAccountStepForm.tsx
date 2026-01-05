import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Lock, Shield, Key } from 'lucide-react';
import { AccountBasicInfoStep } from './steps/AccountBasicInfoStep';
import { MainPermissionsStep } from './steps/MainPermissionsStep';
import { ApiPermissionsStep } from './steps/ApiPermissionsStep';
import { AddAccountStepHeader } from './AddAccountStepHeader';
import type { EmpSearchRes } from '../../../types/core/EmpSearchRes';
import type { RegStep1, RegStep2, RegStep3, UUID } from '../../../types/auth/registration';
import { registrationService } from '../../../services/auth/registerservice';
import toast from 'react-hot-toast';

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
  const [userId, setUserId] = useState<string>('');

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
    setUserId('');
  };

  // Handle Step 1 submission with API integration
  const handleStep1Submit = async (step1Data: any) => {
    setLoading(true);
    setError(null);

    try {
      if (!employee?.id) {
        throw new Error('Employee ID not found');
      }

      // Prepare registration step 1 data
      const regStep1Data: RegStep1 = {
        employeeId: employee.id as UUID,
        password: step1Data.password,
        roleId: step1Data.role,
        perModules: step1Data.modules.map((id: string) => id as UUID)
      };

      console.log('Calling registration step 1:', regStep1Data);

      // Call registration service step 1
      const result = await registrationService.step1(regStep1Data);
      
      console.log('Registration step 1 completed:', result);

      // Store user ID for next steps
      setUserId(result.userId);

      // Update form data
      const updatedFormData = {
        ...formData,
        step1: step1Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('accountFormData', JSON.stringify(updatedFormData));

      // Show success message
      toast.success('Account created successfully!');

      scrollToTop();
      setCurrentStep(prev => prev + 1);

    } catch (error: any) {
      console.error('Failed to save basic info:', error);
      const errorMessage = error.message || 'Failed to create account. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 submission with API integration
  const handleStep2Submit = async (step2Data: any) => {
    if (formData.step1.modules.length === 0) {
      const errorMsg = 'Please select at least one module in Step 1 first.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!userId) {
      const errorMsg = 'Account not created. Please complete Step 1 first.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare registration step 2 data
      const regStep2Data: Omit<RegStep2, 'userId'> = {
        perMenus: step2Data.permissions.map((id: string) => id as UUID)
      };

      console.log('Calling registration step 2:', { userId, ...regStep2Data });

      // Call registration service step 2
      const result = await registrationService.step2({
        userId,
        ...regStep2Data
      });
      
      console.log('Registration step 2 completed:', result);

      // Update form data
      const updatedFormData = {
        ...formData,
        step2: step2Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('accountFormData', JSON.stringify(updatedFormData));

      // Show success message
      toast.success('Menu permissions saved successfully!');

      scrollToTop();
      setCurrentStep(prev => prev + 1);

    } catch (error: any) {
      console.error('Failed to save permissions:', error);
      const errorMessage = error.message || 'Failed to save menu permissions. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 submission with API integration
  const handleStep3Submit = async (step3Data: any) => {
    if (formData.step2.permissions.length === 0) {
      const errorMsg = 'Please select at least one permission in Step 2 first.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!userId) {
      const errorMsg = 'Account not found. Please complete previous steps first.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare registration step 3 data
      const regStep3Data: Omit<RegStep3, 'userId'> = {
        perAccess: step3Data.apiPermissions.map((id: string) => id as UUID)
      };

      console.log('Calling registration step 3:', { userId, ...regStep3Data });

      // Call registration service step 3
      const result = await registrationService.step3({
        userId,
        ...regStep3Data
      });
      
      console.log('Registration step 3 completed:', result);

      // Prepare final data for callback
      const finalData = {
        userId: result.userId,
        employeeId: employee?.id || '',
        employeeCode: getEmployeeCode(),
        employeeName: getEmployeeDisplayName(),
        email: getEmployeeEmail(),
        role: formData.step1.role,
        modules: formData.step1.modules,
        permissions: formData.step2.permissions,
        detailedPermissions: step3Data.apiPermissions,
      };

      console.log('Account creation completed:', finalData);
      
      // Show success message
      toast.success('Account setup completed successfully!');

      clearTemporaryData();

      // Call the callback with result
      onAccountAdded({
        success: true,
        message: 'Account created successfully',
        accountId: result.userId,
        ...finalData
      });
      
    } catch (error: any) {
      console.error('Failed to create account:', error);
      const errorMessage = error.message || 'Failed to complete account setup. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Handle complete registration in one go
  const handleCompleteRegistration = async () => {
    if (!employee?.id) {
      toast.error('Employee ID not found');
      return;
    }

    // Check if Step 1 data is complete
    if (!formData.step1.password || !formData.step1.role || formData.step1.modules.length === 0) {
      toast.error('Please complete Step 1 first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare all data
      const regStep1Data: RegStep1 = {
        employeeId: employee.id as UUID,
        password: formData.step1.password,
        roleId: formData.step1.role,
        perModules: formData.step1.modules.map(id => id as UUID)
      };

      const regStep2Data: Omit<RegStep2, 'userId'> = {
        perMenus: formData.step2.permissions.map(id => id as UUID)
      };

      const regStep3Data: Omit<RegStep3, 'userId'> = {
        perAccess: formData.step3.apiPermissions.map(id => id as UUID)
      };

      console.log('Starting complete registration...', {
        step1: regStep1Data,
        step2: regStep2Data,
        step3: regStep3Data
      });

      // Call complete registration
      const result = await registrationService.completeRegistration(
        regStep1Data,
        regStep2Data,
        regStep3Data
      );
      
      console.log('Complete registration successful:', result);

      // Prepare final data
      const finalData = {
        userId: result.userId,
        employeeId: employee.id,
        employeeCode: getEmployeeCode(),
        employeeName: getEmployeeDisplayName(),
        email: getEmployeeEmail(),
        role: formData.step1.role,
        modules: formData.step1.modules,
        permissions: formData.step2.permissions,
        detailedPermissions: formData.step3.apiPermissions,
      };

      toast.success('Account created successfully!');

      clearTemporaryData();

      onAccountAdded({
        success: true,
        message: 'Account created successfully',
        accountId: result.userId,
        ...finalData
      });

    } catch (error: any) {
      console.error('Failed complete registration:', error);
      const errorMessage = error.message || 'Failed to create account. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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

      {/* Status Display */}
      {userId && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Account created with User ID: <span className="font-semibold">{userId}</span>
          </p>
        </div>
      )}

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

      {/* Complete Registration Button (Optional) */}
      {currentStep === 3 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center">
            <button
              onClick={handleCompleteRegistration}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? 'Processing...' : 'Complete Registration'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};