import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { User, FileText, Users, Shield, CheckCircle } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BiographicalStep } from './steps/BiograohicalStep';
import { EmergencyContactStep } from './steps/EmergencyContactStep';
import { GuarantorStep } from './steps/GurantorStep';
import { ReviewStep } from './steps/ReviewStep';
import { AddEmployeeStepHeader } from './AddEmployeeStepHeader';
import { empService } from '../../../../services/hr/employee/empService';
import type { Step1Dto, Step2Dto, Step3Dto, Step4Dto, Step5Dto, EmpAddRes, UUID } from '../../../../types/hr/employee/empAddDto';

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Biographical', icon: FileText },
  { id: 3, title: 'Emergency Contact', icon: Users },
  { id: 4, title: 'Guarantor', icon: Shield },
  { id: 5, title: 'Print', icon: CheckCircle },
];

interface AddEmployeeStepFormProps {
  onBackToEmployees: () => void;
  onEmployeeAdded: (result: any) => void;
}

export const AddEmployeeStepForm: React.FC<AddEmployeeStepFormProps> = ({
  onBackToEmployees,
  onEmployeeAdded,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  });
  const [employeeId, setEmployeeId] = useState<UUID | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when step changes
  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }

    if (document.body) {
      document.body.scrollTop = 0;
    }

    if (formContainerRef.current) {
      formContainerRef.current.scrollTop = 0;
    }

    if (stepContentRef.current) {
      stepContentRef.current.scrollTop = 0;
    }
  };

  // Clear all temporary data
  const clearTemporaryData = () => {
    localStorage.removeItem('employeeFormData');
    localStorage.removeItem('employeeId');
    setFormData({
      step1: {},
      step2: {},
      step3: {},
      step4: {},
    });
    setEmployeeId(undefined);
    setCurrentStep(1);
  };

  // Handle Step 1 submission with service call
  const handleStep1Submit = async (step1Data: Step1Dto & { branchId: UUID }) => {
    setLoading(true);
    setError(null);

    try {
      const result: EmpAddRes = await empService.empAddStep1(step1Data);

      console.log('Employee created successfully:', result.id);
      setEmployeeId(result.id);

      const updatedFormData = {
        ...formData,
        step1: step1Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('employeeFormData', JSON.stringify(updatedFormData));
      localStorage.setItem('employeeId', result.id);

      scrollToTop();
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Failed to create employee:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create employee. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 submission with service call
  const handleStep2Submit = async (step2Data: Step2Dto) => {
    if (!employeeId) {
      setError('Employee ID is missing. Please complete Step 1 first to create an employee record.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const step2DataWithEmployeeId: Step2Dto = {
        ...step2Data,
        employeeId: employeeId
      };

      const result: EmpAddRes = await empService.empAddStep2(step2DataWithEmployeeId);

      console.log('Biographical info added successfully:', result);

      const updatedFormData = {
        ...formData,
        step2: step2Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('employeeFormData', JSON.stringify(updatedFormData));

      scrollToTop();
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Failed to add biographical info:', error);
      setError('Failed to save biographical information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 submission with service call
  const handleStep3Submit = async (step3Data: Step3Dto) => {
    if (!employeeId) {
      setError('Employee ID is missing. Please complete Step 1 first to create an employee record.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const step3DataWithEmployeeId: Step3Dto = {
        ...step3Data,
        employeeId: employeeId
      };

      const result: EmpAddRes = await empService.empAddStep3(step3DataWithEmployeeId);

      console.log('Emergency contact added successfully:', result);

      const updatedFormData = {
        ...formData,
        step3: step3Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('employeeFormData', JSON.stringify(updatedFormData));

      scrollToTop();
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Failed to update emergency contact:', error);
      setError('Failed to save emergency contact information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 4 submission with service call
  const handleStep4Submit = async (step4Data: Step4Dto) => {
    if (!employeeId) {
      setError('Employee ID is missing. Please complete Step 1 first to create an employee record.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const step4DataWithEmployeeId: Step4Dto = {
        ...step4Data,
        employeeId: employeeId
      };

      const result: EmpAddRes = await empService.empAddStep4(step4DataWithEmployeeId);

      console.log('Guarantor added successfully:', result);

      const updatedFormData = {
        ...formData,
        step4: step4Data,
      };

      setFormData(updatedFormData);
      localStorage.setItem('employeeFormData', JSON.stringify(updatedFormData));

      scrollToTop();
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Failed to update guarantor info:', error);
      setError('Failed to save guarantor information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 5 submission with service call - UPDATED to clear temporary data
  const handleStep5Submit = async (step5Data: Step5Dto) => {
    if (!employeeId) {
      setError('Employee ID is missing. Please complete Step 1 first to create an employee record.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the Step 5 service to complete employee submission
      const result: EmpAddRes = await empService.submitEmployee(step5Data);

      console.log('Employee submission completed successfully:', result);

      // Clear all temporary data after successful submission
      clearTemporaryData();

      // Call the parent callback with the result
      onEmployeeAdded(result);
    } catch (error) {
      console.error('Failed to complete employee submission:', error);
      setError('Failed to complete employee submission. Please try again.');
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
      onBackToEmployees();
    }
  };

  // Handle back to employees without clearing data (for temporary saving)
  const handleBackToEmployees = () => {
    // Don't clear data when going back temporarily - allow user to continue later
    onBackToEmployees();
  };

  // Load saved form data and employee ID on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('employeeFormData');
    const savedEmployeeId = localStorage.getItem('employeeId');

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }

    if (savedEmployeeId) {
      setEmployeeId(savedEmployeeId as UUID);
    }

    scrollToTop();
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData.step1}
            onNext={handleStep1Submit}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 2:
        return (
          <BiographicalStep
            data={formData.step2}
            onNext={handleStep2Submit}
            onBack={handleBack}
            employeeId={employeeId}
            loading={loading}
          />
        );
      case 3:
        return (
          <EmergencyContactStep
            data={formData.step3}
            onNext={handleStep3Submit}
            onBack={handleBack}
            employeeId={employeeId}
            loading={loading}
          />
        );
      case 4:
        return (
          <GuarantorStep
            data={formData.step4}
            onNext={handleStep4Submit}
            onBack={handleBack}
            employeeId={employeeId}
            loading={loading}
          />
        );
      case 5:
        return (
          <ReviewStep
            employeeId={employeeId}
            onSubmit={handleStep5Submit}
            onBack={handleBack}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" ref={formContainerRef}>
      <div className="mx-auto">
        <AddEmployeeStepHeader
          steps={steps}
          currentStep={currentStep}
          onBack={handleBackToEmployees}
          title="Add New Employee"
          backButtonText="Back to Employees"
        />

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-800 hover:text-red-900"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          ref={stepContentRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 px-8 py-4"
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};