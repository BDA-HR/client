import React from 'react';
import { Button } from '../../../../components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
}

interface AddEmployeeStepHeaderProps {
  steps: Step[];
  currentStep: number;
  onBack: () => void;
  title: string;
  backButtonText?: string;
}

export const AddEmployeeStepHeader: React.FC<AddEmployeeStepHeaderProps> = ({
  steps,
  currentStep,
  onBack,
  title,
  backButtonText = 'Back to Employees',
}) => {
  return (
    <>
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 mr-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {backButtonText}
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        </div>
        <div className="w-32"></div> {/* Spacer for balance */}
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium text-center ${
                      isCurrent || isCompleted
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">Step {step.id}</span>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};