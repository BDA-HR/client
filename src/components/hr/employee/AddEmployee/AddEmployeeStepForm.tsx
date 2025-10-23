import React from 'react';
import { Formik, Form } from 'formik';
import type { FormikProps } from 'formik';
import { AnimatePresence } from 'framer-motion';
import { Button } from '../../../../components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { EmployeeAddDto } from '../../../../types/employee';

interface AddEmployeeStepFormProps {
  currentStep: number;
  totalSteps: number;
  snapshot: EmployeeAddDto;
  validationSchemas: any[];
  onSubmit: (values: EmployeeAddDto, actions: any) => void;
  onBack: (values: EmployeeAddDto) => void;
  renderStepContent: (formikProps: FormikProps<EmployeeAddDto>) => React.ReactNode;
  isSubmitting?: boolean;
}

export const AddEmployeeStepForm: React.FC<AddEmployeeStepFormProps> = ({
  currentStep,
  totalSteps,
  snapshot,
  validationSchemas,
  onSubmit,
  onBack,
  renderStepContent,
  isSubmitting = false,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <Formik
      initialValues={snapshot}
      validationSchema={validationSchemas[currentStep]}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(formikProps) => (
        <Form>
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-8">
            <AnimatePresence mode="wait">
              {renderStepContent({ ...formikProps, isSubmitting })}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onBack(formikProps.values)}
                disabled={currentStep === 0 || formikProps.isSubmitting}
                className="flex items-center gap-2"
              >
                Back
              </Button>

              <Button
                type="submit"
                disabled={formikProps.isSubmitting || !formikProps.isValid || isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {(formikProps.isSubmitting || isSubmitting) ? (
                  'Processing...'
                ) : isLastStep ? (
                  'Complete Registration'
                ) : (
                  'Save & Continue'
                )}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};