import React from 'react';
import { Formik, Form } from 'formik';
import type { FormikProps } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import { Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../../../components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { EmployeeAddDto, JobGradeDto, DepartmentDto, EmploymentTypeDto, EmploymentNatureDto } from '../../../../types/hr/employee';
import type { UUID } from 'crypto';

// Validation Schemas
const basicInfoValidationSchema = Yup.object({
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
  jobGradeId: Yup.string()
    .required('Job grade is required'),
  positionId: Yup.string()
    .required('Position is required'),
  departmentId: Yup.string()
    .required('Department is required'),
  employmentTypeId: Yup.string()
    .required('Employment type is required'),
  employmentNatureId: Yup.string()
    .required('Employment nature is required'),
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
  { id: '4' as UUID, name: 'Marketing', nameAm: 'ግብይት' },
  { id: '5' as UUID, name: 'Operations', nameAm: 'ኦፕሬሽን' },
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
  basicInfoValidationSchema,
  Yup.object({}), // Empty validation for second step since all fields are in first step now
];

interface AddEmployeeStepFormProps {
  currentStep: number;
  totalSteps: number;
  snapshot: EmployeeAddDto;
  onSubmit: (values: EmployeeAddDto, actions: any) => void;
  onBack: (values: EmployeeAddDto) => void;
  isSubmitting?: boolean;
}

export const AddEmployeeStepForm: React.FC<AddEmployeeStepFormProps> = ({
  currentStep,
  totalSteps,
  snapshot,
  onSubmit,
  onBack,
  isSubmitting = false,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  const renderStepContent = (formikProps: FormikProps<EmployeeAddDto> & { isSubmitting?: boolean }) => {
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
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
              <p className="text-gray-600 mt-2">
                Enter all the required information for the new employee.
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

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Review Information</h2>
              <p className="text-gray-600 mt-2">
                Please review all the information before submitting.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Basic Information</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Full Name (English)</dt>
                      <dd className="font-medium">{values.firstName} {values.middleName} {values.lastName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Full Name (Amharic)</dt>
                      <dd className="font-medium">{values.firstNameAm} {values.middleNameAm} {values.lastNameAm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Gender</dt>
                      <dd className="font-medium">{values.gender === '1' ? 'Male' : 'Female'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Nationality</dt>
                      <dd className="font-medium">{values.nationality}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Employment Date</dt>
                      <dd className="font-medium">{values.employmentDate}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Employment Details</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Job Grade</dt>
                      <dd className="font-medium">
                        {mockJobGrades.find(g => g.id === values.jobGradeId)?.name || 'Not selected'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Department</dt>
                      <dd className="font-medium">
                        {mockDepartments.find(d => d.id === values.departmentId)?.name || 'Not selected'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Position</dt>
                      <dd className="font-medium">{values.positionId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Employment Type</dt>
                      <dd className="font-medium">
                        {mockEmploymentTypes.find(t => t.id === values.employmentTypeId)?.name || 'Not selected'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Employment Nature</dt>
                      <dd className="font-medium">
                        {mockEmploymentNatures.find(n => n.id === values.employmentNatureId)?.name || 'Not selected'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

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