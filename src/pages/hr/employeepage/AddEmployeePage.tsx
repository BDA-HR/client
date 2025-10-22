import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form, Field} from 'formik';
import type {FormikProps  } from 'formik';
import * as Yup from 'yup';
import { ChevronRight, User, Building, Users, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';

// Validation Schemas for each step
const step1ValidationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

const step2ValidationSchema = Yup.object({
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  businessType: Yup.string()
    .required('Business type is required'),
  employeeCount: Yup.string()
    .required('Employee count is required'),
  taxId: Yup.string()
    .required('Tax ID is required')
    .min(5, 'Tax ID must be at least 5 characters'),
  address: Yup.string()
    .required('Business address is required')
    .min(10, 'Address must be at least 10 characters')
});

const step3ValidationSchema = Yup.object({
  additionalUsers: Yup.array().of(
    Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      role: Yup.string().required('Role is required')
    })
  )
});

// Combined validation schema
const validationSchemas = [
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema
];

interface EmployeeFormData {
  // Step 1: Your Profile
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Business Information
  companyName: string;
  businessType: string;
  employeeCount: string;
  taxId: string;
  address: string;
  
  // Step 3: Additional Users
  additionalUsers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
}

const initialValues: EmployeeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  businessType: '',
  employeeCount: '',
  taxId: '',
  address: '',
  additionalUsers: []
};

const steps = [
  { id: 1, title: 'Your Profile', icon: User },
  { id: 2, title: 'Business Information', icon: Building },
  { id: 3, title: 'Additional Users', icon: Users }
];

const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [snapshot, setSnapshot] = useState<EmployeeFormData>(initialValues);

  const isLastStep = currentStep === steps.length - 1;

  const handleNext = (values: EmployeeFormData) => {
    setSnapshot(values);
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handleBack = (values: EmployeeFormData) => {
    setSnapshot(values);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async (values: EmployeeFormData, actions: any) => {
    if (isLastStep) {
      await submitForm(values, actions);
    } else {
      actions.setTouched({});
      actions.setSubmitting(false);
      handleNext(values);
    }
  };

  const submitForm = async (values: EmployeeFormData, actions: any) => {
    try {
      console.log('Form submitted:', values);
      // Here you would typically make an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Navigate to success page or employees list
      navigate('/employees');
    } catch (error) {
      console.error('Submission error:', error);
      actions.setSubmitting(false);
    }
  };

  const renderStepContent = (formikProps: FormikProps<EmployeeFormData>) => {
    const { errors, touched, values, setFieldValue } = formikProps;

    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
              <p className="text-gray-600 mt-2">
                Enter the login information for your account. You will be able to create additional users after registering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.firstName && touched.firstName
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Your First Name"
                />
                {errors.firstName && touched.firstName && (
                  <div className="text-red-600 text-sm mt-1">{errors.firstName}</div>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.lastName && touched.lastName
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Your Last Name"
                />
                {errors.lastName && touched.lastName && (
                  <div className="text-red-600 text-sm mt-1">{errors.lastName}</div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email && touched.email
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Your Email"
                />
                {errors.email && touched.email && (
                  <div className="text-red-600 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.phoneNumber && touched.phoneNumber
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Your Phone Number"
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <div className="text-red-600 text-sm mt-1">{errors.phoneNumber}</div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.password && touched.password
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Create Password"
                />
                {errors.password && touched.password && (
                  <div className="text-red-600 text-sm mt-1">{errors.password}</div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm Your Password"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="text-red-600 text-sm mt-1">{errors.confirmPassword}</div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
              <p className="text-gray-600 mt-2">
                Enter your company details and business information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <Field
                  id="companyName"
                  name="companyName"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.companyName && touched.companyName
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Company Name"
                />
                {errors.companyName && touched.companyName && (
                  <div className="text-red-600 text-sm mt-1">{errors.companyName}</div>
                )}
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <Field
                  as="select"
                  id="businessType"
                  name="businessType"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.businessType && touched.businessType
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Business Type</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                </Field>
                {errors.businessType && touched.businessType && (
                  <div className="text-red-600 text-sm mt-1">{errors.businessType}</div>
                )}
              </div>

              <div>
                <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Count *
                </label>
                <Field
                  as="select"
                  id="employeeCount"
                  name="employeeCount"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.employeeCount && touched.employeeCount
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Employee Count</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </Field>
                {errors.employeeCount && touched.employeeCount && (
                  <div className="text-red-600 text-sm mt-1">{errors.employeeCount}</div>
                )}
              </div>

              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID *
                </label>
                <Field
                  id="taxId"
                  name="taxId"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.taxId && touched.taxId
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Tax ID"
                />
                {errors.taxId && touched.taxId && (
                  <div className="text-red-600 text-sm mt-1">{errors.taxId}</div>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <Field
                  as="textarea"
                  id="address"
                  name="address"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.address && touched.address
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Business Address"
                />
                {errors.address && touched.address && (
                  <div className="text-red-600 text-sm mt-1">{errors.address}</div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Additional Users</h2>
              <p className="text-gray-600 mt-2">
                Add additional team members to your account (optional).
              </p>
            </div>

            <div className="space-y-4">
              {values.additionalUsers.map((user, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">User {index + 1}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newUsers = values.additionalUsers.filter((_, i) => i !== index);
                        setFieldValue('additionalUsers', newUsers);
                      }}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Field
                        name={`additionalUsers[${index}].firstName`}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.additionalUsers?.[index]?.['firstName' as keyof typeof user] && 
                          touched.additionalUsers?.[index]?.['firstName' as keyof typeof user]
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Field
                        name={`additionalUsers[${index}].lastName`}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.additionalUsers?.[index]?.['lastName' as keyof typeof user] && 
                          touched.additionalUsers?.[index]?.['lastName' as keyof typeof user]
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Field
                        name={`additionalUsers[${index}].email`}
                        type="email"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.additionalUsers?.[index]?.['email' as keyof typeof user] && 
                          touched.additionalUsers?.[index]?.['email' as keyof typeof user]
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <Field
                        as="select"
                        name={`additionalUsers[${index}].role`}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.additionalUsers?.[index]?.['role' as keyof typeof user] && 
                          touched.additionalUsers?.[index]?.['role' as keyof typeof user]
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Role</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </Field>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newUsers = [...values.additionalUsers, { firstName: '', lastName: '', email: '', role: '' }];
                  setFieldValue('additionalUsers', newUsers);
                }}
                className="w-full border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50"
              >
                + Add Another User
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Employee Registration</h1>
          <p className="text-lg text-gray-600">Complete the following steps to register a new employee</p>
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
                  <div className="flex flex-col items-center">
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
                      className={`mt-2 text-sm font-medium ${
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
                      className={`flex-1 h-1 mx-4 ${
                        currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={snapshot}
          validationSchema={validationSchemas[currentStep]}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form>
              <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-8">
                <AnimatePresence mode="wait">
                  {renderStepContent(formikProps)}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleBack(formikProps.values)}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {formikProps.isSubmitting ? (
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
      </div>
    </div>
  );
};

export default AddEmployeePage;