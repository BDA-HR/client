import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { User, FileText, Users, Shield, CheckCircle } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BiographicalStep } from './steps/BiograohicalStep';
import { EmergencyContactStep } from './steps/EmergencyContactStep';
import { GuarantorStep } from './steps/GurantorStep';
import { ReviewStep } from './steps/ReviewStep';
import { AddEmployeeStepHeader } from './AddEmployeeStepHeader';

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Biographical', icon: FileText },
  { id: 3, title: 'Emergency Contact', icon: Users },
  { id: 4, title: 'Guarantor', icon: Shield },
  { id: 5, title: 'Review', icon: CheckCircle },
];

interface AddEmployeeStepFormProps {
  onBackToEmployees: () => void;
  onEmployeeAdded: (result: any) => void;
}

export const AddEmployeeStepForm: React.FC<AddEmployeeStepFormProps> = ({
  onBackToEmployees,
  onEmployeeAdded,
}) => {
  const [currentStep, setCurrentStep] = useState(1); // Start from step 1 (Basic Info)

  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  });

  const handleNext = (stepData: any) => {
    setFormData(prev => ({
      ...prev,
      [`step${currentStep}`]: stepData,
    }));
    
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBackToEmployees();
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would typically make an API call to submit all the data
      const finalData = {
        ...formData.step1,
        ...formData.step2,
        ...formData.step3,
        ...formData.step4,
      };
      
      console.log('Submitting employee data:', finalData);
      
      // Simulate API call
      // const result = await employeeApi.addEmployee(finalData);
      const mockResult = { id: '123e4567-e89b-12d3-a456-426614174000' };
      
      onEmployeeAdded(mockResult);
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData.step1}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <BiographicalStep
            data={formData.step2}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <EmergencyContactStep
            data={formData.step3}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <GuarantorStep
            data={formData.step4}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <ReviewStep
            step1Data={formData.step1}
            step2Data={formData.step2}
            step3Data={formData.step3}
            step4Data={formData.step4}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <AddEmployeeStepHeader
          steps={steps}
          currentStep={currentStep}
          onBack={onBackToEmployees}
          title="Add New Employee"
          backButtonText="Back to Employees"
        />
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 px-8 py-4">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};