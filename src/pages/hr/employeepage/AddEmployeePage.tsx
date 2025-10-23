import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { FormikProps } from 'formik';
import { Field } from 'formik';
import * as Yup from 'yup';
import { User, Building} from 'lucide-react';
import type { UUID } from 'crypto';

// Import components
import { AddEmployeeStepHeader } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepHeader';
import { AddEmployeeStepForm } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepForm';
import type { EmployeeAddDto, JobGradeDto, DepartmentDto, EmploymentTypeDto, EmploymentNatureDto } from '../../../types/hr/employee';

// Validation Schemas
const personalInfoValidationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name in English is required')
    .min(2, 'First name must be at least 2 characters'),
  firstNameAm: Yup.string()
    .required('First name in Amharic is required')
    .min(2, 'First name must be at least 2 characters'),
  middleName: Yup.string().optional(),
  middleNameAm: Yup.string().optional(),
  lastName: Yup.string()
    .required('Last name in English is required')
    .min(2, 'Last name must be at least 2 characters'),
  lastNameAm: Yup.string()
    .required('Last name in Amharic is required')
    .min(2, 'Last name must be at least 2 characters'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['0', '1'], 'Please select a valid gender'),
  nationality: Yup.string()
    .required('Nationality is required')
    .min(2, 'Nationality must be at least 2 characters'),
  employmentDate: Yup.date()
    .required('Employment date is required')
    .max(new Date(), 'Employment date cannot be in the future'),
});

const employmentDetailsValidationSchema = Yup.object({
  jobGradeId: Yup.string()
    .required('Job grade is required')
    .uuid('Invalid job grade selection'),
  positionId: Yup.string()
    .required('Position is required')
    .uuid('Invalid position selection'),
  departmentId: Yup.string()
    .required('Department is required')
    .uuid('Invalid department selection'),
  employmentTypeId: Yup.string()
    .required('Employment type is required')
    .uuid('Invalid employment type selection'),
  employmentNatureId: Yup.string()
    .required('Employment nature is required')
    .uuid('Invalid employment nature selection'),
});

// Mock data for dropdowns (replace with actual API calls)
const mockJobGrades: JobGradeDto[] = [
  { id: '1' as UUID, name: 'Grade 1', nameAm: 'ግሬድ 1' },
  { id: '2' as UUID, name: 'Grade 2', nameAm: 'ግሬድ 2' },
  { id: '3' as UUID, name: 'Grade 3', nameAm: 'ግሬድ 3' },
];

const mockDepartments: DepartmentDto[] = [
  { id: '1' as UUID, name: 'Engineering', nameAm: 'ኢንጂነሪንግ' },
  { id: '2' as UUID, name: 'Human Resources', nameAm: 'ሰው ሀብት' },
  { id: '3' as UUID, name: 'Finance', nameAm: 'ፋይናንስ' },
];

const mockEmploymentTypes: EmploymentTypeDto[] = [
  { id: '1' as UUID, name: 'Full-time', nameAm: 'ሙሉ ጊዜ' },
  { id: '2' as UUID, name: 'Part-time', nameAm: 'ከፊል ጊዜ' },
  { id: '3' as UUID, name: 'Contract', nameAm: 'ኮንትራት' },
];

const mockEmploymentNatures: EmploymentNatureDto[] = [
  { id: '1' as UUID, name: 'Permanent', nameAm: 'ቋሚ' },
  { id: '2' as UUID, name: 'Temporary', nameAm: 'ጊዜያዊ' },
  { id: '3' as UUID, name: 'Probation', nameAm: 'ሙከራ' },
];

const validationSchemas = [
  personalInfoValidationSchema,
  employmentDetailsValidationSchema,
];

interface EmployeeFormData extends EmployeeAddDto {
  jobGradeId: UUID;
  positionId: UUID;
  departmentId: UUID;
  employmentTypeId: UUID;
  employmentNatureId: UUID;
}

const initialValues: EmployeeFormData = {
  firstName: '',
  firstNameAm: '',
  middleName: '',
  middleNameAm: '',
  lastName: '',
  lastNameAm: '',
  gender: '1' as '0' | '1',
  nationality: 'Ethiopian',
  employmentDate: new Date().toISOString().split('T')[0],
  jobGradeId: '' as UUID,
  positionId: '' as UUID,
  departmentId: '' as UUID,
  employmentTypeId: '' as UUID,
  employmentNatureId: '' as UUID,
};

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Employment Details', icon: Building },
];

const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [snapshot, setSnapshot] = useState<EmployeeFormData>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackToEmployees = () => {
    navigate('/employees');
  };

  const handleNext = (values: EmployeeFormData) => {
    setSnapshot(values);
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handleBack = (values: EmployeeFormData) => {
    setSnapshot(values);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async (values: EmployeeFormData, actions: any) => {
    if (currentStep === steps.length - 1) {
      await submitForm(values, actions);
    } else {
      actions.setTouched({});
      actions.setSubmitting(false);
      handleNext(values);
    }
  };

  const submitForm = async (values: EmployeeFormData, actions: any) => {
    setIsSubmitting(true);
    try {
      console.log('Form submitted:', values);
      // Here you would typically make an API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Navigate to success page or employees list
      navigate('/employees');
    } catch (error) {
      console.error('Submission error:', error);
      actions.setSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (formikProps: FormikProps<EmployeeFormData> & { isSubmitting?: boolean }) => {
    const { errors, touched, values } = formikProps;

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
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-gray-600 mt-2">
                Enter the personal details for the new employee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name (English) */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name (English) *
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
                  placeholder="Input First Name in English"
                />
                {errors.firstName && touched.firstName && (
                  <div className="text-red-600 text-sm mt-1">{errors.firstName}</div>
                )}
              </div>

              {/* First Name (Amharic) */}
              <div>
                <label htmlFor="firstNameAm" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name (Amharic) *
                </label>
                <Field
                  id="firstNameAm"
                  name="firstNameAm"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.firstNameAm && touched.firstNameAm
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="መጀመሪያ ስም በአማርኛ"
                />
                {errors.firstNameAm && touched.firstNameAm && (
                  <div className="text-red-600 text-sm mt-1">{errors.firstNameAm}</div>
                )}
              </div>

              {/* Middle Name (English) */}
              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name (English)
                </label>
                <Field
                  id="middleName"
                  name="middleName"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.middleName && touched.middleName
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Middle Name in English"
                />
                {errors.middleName && touched.middleName && (
                  <div className="text-red-600 text-sm mt-1">{errors.middleName}</div>
                )}
              </div>

              {/* Middle Name (Amharic) */}
              <div>
                <label htmlFor="middleNameAm" className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name (Amharic)
                </label>
                <Field
                  id="middleNameAm"
                  name="middleNameAm"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.middleNameAm && touched.middleNameAm
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="መካከለኛ ስም በአማርኛ"
                />
                {errors.middleNameAm && touched.middleNameAm && (
                  <div className="text-red-600 text-sm mt-1">{errors.middleNameAm}</div>
                )}
              </div>

              {/* Last Name (English) */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name (English) *
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
                  placeholder="Input Last Name in English"
                />
                {errors.lastName && touched.lastName && (
                  <div className="text-red-600 text-sm mt-1">{errors.lastName}</div>
                )}
              </div>

              {/* Last Name (Amharic) */}
              <div>
                <label htmlFor="lastNameAm" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name (Amharic) *
                </label>
                <Field
                  id="lastNameAm"
                  name="lastNameAm"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.lastNameAm && touched.lastNameAm
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="የአባት ስም በአማርኛ"
                />
                {errors.lastNameAm && touched.lastNameAm && (
                  <div className="text-red-600 text-sm mt-1">{errors.lastNameAm}</div>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <Field
                  as="select"
                  id="gender"
                  name="gender"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.gender && touched.gender
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </Field>
                {errors.gender && touched.gender && (
                  <div className="text-red-600 text-sm mt-1">{errors.gender}</div>
                )}
              </div>

              {/* Nationality */}
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality *
                </label>
                <Field
                  id="nationality"
                  name="nationality"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.nationality && touched.nationality
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Nationality"
                  value={values.nationality}
                />
                {errors.nationality && touched.nationality && (
                  <div className="text-red-600 text-sm mt-1">{errors.nationality}</div>
                )}
              </div>

              {/* Employment Date */}
              <div>
                <label htmlFor="employmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Date *
                </label>
                <Field
                  id="employmentDate"
                  name="employmentDate"
                  type="date"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.employmentDate && touched.employmentDate
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                />
                {errors.employmentDate && touched.employmentDate && (
                  <div className="text-red-600 text-sm mt-1">{errors.employmentDate}</div>
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
              <h2 className="text-2xl font-bold text-gray-900">Employment Details</h2>
              <p className="text-gray-600 mt-2">
                Enter the employment information for the new employee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Grade */}
              <div>
                <label htmlFor="jobGradeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Grade *
                </label>
                <Field
                  as="select"
                  id="jobGradeId"
                  name="jobGradeId"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.jobGradeId && touched.jobGradeId
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Job Grade</option>
                  {mockJobGrades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </Field>
                {errors.jobGradeId && touched.jobGradeId && (
                  <div className="text-red-600 text-sm mt-1">{errors.jobGradeId}</div>
                )}
              </div>

              {/* Department */}
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <Field
                  as="select"
                  id="departmentId"
                  name="departmentId"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.departmentId && touched.departmentId
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Field>
                {errors.departmentId && touched.departmentId && (
                  <div className="text-red-600 text-sm mt-1">{errors.departmentId}</div>
                )}
              </div>

              {/* Position */}
              <div>
                <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <Field
                  id="positionId"
                  name="positionId"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.positionId && touched.positionId
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Input Position"
                />
                {errors.positionId && touched.positionId && (
                  <div className="text-red-600 text-sm mt-1">{errors.positionId}</div>
                )}
              </div>

              {/* Employment Type */}
              <div>
                <label htmlFor="employmentTypeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type *
                </label>
                <Field
                  as="select"
                  id="employmentTypeId"
                  name="employmentTypeId"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.employmentTypeId && touched.employmentTypeId
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Employment Type</option>
                  {mockEmploymentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Field>
                {errors.employmentTypeId && touched.employmentTypeId && (
                  <div className="text-red-600 text-sm mt-1">{errors.employmentTypeId}</div>
                )}
              </div>

              {/* Employment Nature */}
              <div>
                <label htmlFor="employmentNatureId" className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Nature *
                </label>
                <Field
                  as="select"
                  id="employmentNatureId"
                  name="employmentNatureId"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.employmentNatureId && touched.employmentNatureId
                      ? 'border-red-300'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Employment Nature</option>
                  {mockEmploymentNatures.map((nature) => (
                    <option key={nature.id} value={nature.id}>
                      {nature.name}
                    </option>
                  ))}
                </Field>
                {errors.employmentNatureId && touched.employmentNatureId && (
                  <div className="text-red-600 text-sm mt-1">{errors.employmentNatureId}</div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Combined Header Component */}
        <AddEmployeeStepHeader
          steps={steps}
          currentStep={currentStep}
          onBack={handleBackToEmployees}
          title="Add New Employee"
          backButtonText="Back to Employees"
        />

        {/* Combined Form Component */}
        <AddEmployeeStepForm
          currentStep={currentStep}
          totalSteps={steps.length}
          snapshot={snapshot}
          validationSchemas={validationSchemas}
          onSubmit={handleSubmit}
          onBack={handleBack}
          renderStepContent={renderStepContent}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddEmployeePage;