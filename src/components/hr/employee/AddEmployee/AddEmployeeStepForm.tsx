import React from 'react';
import { Formik, Form } from 'formik';
import type { FormikProps } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';
import { Button } from '../../../../components/ui/button';
import { ChevronRight, User, Briefcase, CheckCircle2 } from 'lucide-react';
import type { EmployeeAddDto, JobGradeDto, DepartmentDto, EmploymentTypeDto, EmploymentNatureDto, PositionDto } from '../../../../types/hr/employee';
import type { UUID } from 'crypto';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Input } from '../../../ui/input';
import { amharicRegex } from '../../../../utils/amharic-regex'; // Import the Amharic regex

// Validation Schemas
const basicInfoValidationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name in English is required')
    .min(2, 'First name must be at least 2 characters'),
  firstNameAm: Yup.string()
    .required('First name in Amharic is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(amharicRegex, 'First name must be in Amharic characters'),
  middleName: Yup.string().optional(),
  middleNameAm: Yup.string()
    .optional()
    .test('amharic-or-empty', 'Middle name must be in Amharic characters', (value) => 
      !value || amharicRegex.test(value)
    ),
  lastName: Yup.string()
    .required('Last name in English is required')
    .min(2, 'Last name must be at least 2 characters'),
  lastNameAm: Yup.string()
    .required('Last name in Amharic is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(amharicRegex, 'Last name must be in Amharic characters'),
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

const mockPositions: PositionDto[] = [
  { id: '1' as UUID, name: 'Software Engineer', nameAm: 'ሶፍትዌር ኢንጂነር' },
  { id: '2' as UUID, name: 'Senior Software Engineer', nameAm: 'ከፍተኛ ሶፍትዌር ኢንጂነር' },
  { id: '3' as UUID, name: 'HR Manager', nameAm: 'ሰው ሀብት ማኔጅር' },
  { id: '4' as UUID, name: 'Finance Analyst', nameAm: 'ፋይናንስ አናላይዝር' },
  { id: '5' as UUID, name: 'Marketing Specialist', nameAm: 'ግብይት ስፔሻሊስት' },
  { id: '6' as UUID, name: 'Operations Manager', nameAm: 'ኦፕሬሽንስ ማኔጅር' },
  { id: '7' as UUID, name: 'Product Manager', nameAm: 'ምርት ማኔጅር' },
  { id: '8' as UUID, name: 'Data Scientist', nameAm: 'ዳታ ሳይንቲስት' },
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

  // Amharic input change handler
  const handleAmharicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      setFieldValue(fieldName, value);
    }
  };

  const renderStepContent = (formikProps: FormikProps<EmployeeAddDto> & { isSubmitting?: boolean }) => {
    const { errors, touched, values, handleChange, handleBlur, setFieldValue } = formikProps;

    // Updated input styling to match the first modal
    const inputClassName = (fieldName: keyof EmployeeAddDto) => 
      `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
        errors[fieldName] && touched[fieldName]
          ? 'border-red-500'
          : 'border-gray-300'
      }`;

    const selectTriggerClassName = (fieldName: keyof EmployeeAddDto) => 
      `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
        errors[fieldName] && touched[fieldName]
          ? 'border-red-500'
          : 'border-gray-300'
      }`;

    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Basic Information
              </h2>
              <p className="text-gray-500 mt-3 text-lg">
                Enter all the required information for the new employee
              </p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                </div>
              </div>

              {/* First Name (English) */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name (English) *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('firstName')}
                  placeholder="John"
                />
                {errors.firstName && touched.firstName && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.firstName}
                  </motion.div>
                )}
              </div>

              {/* First Name (Amharic) */}
              <div className="space-y-2">
                <label htmlFor="firstNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name (Amharic) *
                </label>
                <Input
                  id="firstNameAm"
                  name="firstNameAm"
                  type="text"
                  value={values.firstNameAm}
                  onChange={(e) => handleAmharicChange(e, 'firstNameAm', setFieldValue)}
                  onBlur={handleBlur}
                  className={inputClassName('firstNameAm')}
                  placeholder="ጆን"
                />
                {errors.firstNameAm && touched.firstNameAm && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.firstNameAm}
                  </motion.div>
                )}
              </div>

              {/* Middle Name (English) */}
              <div className="space-y-2">
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name (English)
                </label>
                <Input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={values.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                  placeholder="Michael"
                />
              </div>

              {/* Middle Name (Amharic) */}
              <div className="space-y-2">
                <label htmlFor="middleNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  Middle Name (Amharic)
                </label>
                <Input
                  id="middleNameAm"
                  name="middleNameAm"
                  type="text"
                  value={values.middleNameAm}
                  onChange={(e) => handleAmharicChange(e, 'middleNameAm', setFieldValue)}
                  onBlur={handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
                  placeholder="ማይክል"
                />
                {errors.middleNameAm && touched.middleNameAm && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.middleNameAm}
                  </motion.div>
                )}
              </div>

              {/* Last Name (English) */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name (English) *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('lastName')}
                  placeholder="Doe"
                />
                {errors.lastName && touched.lastName && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.lastName}
                  </motion.div>
                )}
              </div>

              {/* Last Name (Amharic) */}
              <div className="space-y-2">
                <label htmlFor="lastNameAm" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name (Amharic) *
                </label>
                <Input
                  id="lastNameAm"
                  name="lastNameAm"
                  type="text"
                  value={values.lastNameAm}
                  onChange={(e) => handleAmharicChange(e, 'lastNameAm', setFieldValue)}
                  onBlur={handleBlur}
                  className={inputClassName('lastNameAm')}
                  placeholder="ዶው"
                />
                {errors.lastNameAm && touched.lastNameAm && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.lastNameAm}
                  </motion.div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <Select 
                  value={values.gender} 
                  onValueChange={(value) => setFieldValue('gender', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('gender')}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="0">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && touched.gender && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.gender}
                  </motion.div>
                )}
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality *
                </label>
                <Input
                  id="nationality"
                  name="nationality"
                  type="text"
                  value={values.nationality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('nationality')}
                  placeholder="Ethiopian"
                />
                {errors.nationality && touched.nationality && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.nationality}
                  </motion.div>
                )}
              </div>

              {/* Employment Details Section */}
              <div className="lg:col-span-2 mt-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Employment Details</h3>
                </div>
              </div>

              {/* Employment Date */}
              <div className="space-y-2">
                <label htmlFor="employmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Date *
                </label>
                <Input
                  id="employmentDate"
                  name="employmentDate"
                  type="date"
                  value={values.employmentDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClassName('employmentDate')}
                />
                {errors.employmentDate && touched.employmentDate && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.employmentDate}
                  </motion.div>
                )}
              </div>

              {/* Job Grade */}
              <div className="space-y-2">
                <label htmlFor="jobGradeId" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Grade *
                </label>
                <Select 
                  value={values.jobGradeId} 
                  onValueChange={(value) => setFieldValue('jobGradeId', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('jobGradeId')}>
                    <SelectValue placeholder="Select Job Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockJobGrades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jobGradeId && touched.jobGradeId && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.jobGradeId}
                  </motion.div>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <Select 
                  value={values.departmentId} 
                  onValueChange={(value) => setFieldValue('departmentId', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('departmentId')}>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentId && touched.departmentId && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.departmentId}
                  </motion.div>
                )}
              </div>

              {/* Position - Changed to Select */}
              <div className="space-y-2">
                <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <Select 
                  value={values.positionId} 
                  onValueChange={(value) => setFieldValue('positionId', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('positionId')}>
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPositions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.positionId && touched.positionId && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.positionId}
                  </motion.div>
                )}
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label htmlFor="employmentTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type *
                </label>
                <Select 
                  value={values.employmentTypeId} 
                  onValueChange={(value) => setFieldValue('employmentTypeId', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('employmentTypeId')}>
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmploymentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employmentTypeId && touched.employmentTypeId && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.employmentTypeId}
                  </motion.div>
                )}
              </div>

              {/* Employment Nature */}
              <div className="space-y-2">
                <label htmlFor="employmentNatureId" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Nature *
                </label>
                <Select 
                  value={values.employmentNatureId} 
                  onValueChange={(value) => setFieldValue('employmentNatureId', value)}
                >
                  <SelectTrigger className={selectTriggerClassName('employmentNatureId')}>
                    <SelectValue placeholder="Select Employment Nature" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmploymentNatures.map((nature) => (
                      <SelectItem key={nature.id} value={nature.id}>
                        {nature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employmentNatureId && touched.employmentNatureId && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.employmentNatureId}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Review Information
              </h2>
              <p className="text-gray-500 mt-3 text-lg">
                Please review all information before submitting
              </p>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                </div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name (English)</dt>
                    <dd className="font-semibold text-gray-900">{values.firstName} {values.middleName} {values.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name (Amharic)</dt>
                    <dd className="font-semibold text-gray-900">{values.firstNameAm} {values.middleNameAm} {values.lastNameAm}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</dt>
                    <dd className="font-semibold text-gray-900">{values.gender === '1' ? 'Male' : 'Female'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationality</dt>
                    <dd className="font-semibold text-gray-900">{values.nationality}</dd>
                  </div>
                </dl>
              </motion.div>

              {/* Employment Details Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
                </div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment Date</dt>
                    <dd className="font-semibold text-gray-900">{values.employmentDate}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Grade</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockJobGrades.find(g => g.id === values.jobGradeId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockDepartments.find(d => d.id === values.departmentId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Position</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockPositions.find(p => p.id === values.positionId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment Type</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockEmploymentTypes.find(t => t.id === values.employmentTypeId)?.name || 'Not selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employment Nature</dt>
                    <dd className="font-semibold text-gray-900">
                      {mockEmploymentNatures.find(n => n.id === values.employmentNatureId)?.name || 'Not selected'}
                    </dd>
                  </div>
                </dl>
              </motion.div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8">
            <AnimatePresence mode="wait">
              {renderStepContent({ ...formikProps, isSubmitting })}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200"
            >
              <div className="flex-1">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onBack(formikProps.values)}
                    disabled={formikProps.isSubmitting}
                    className="cursor-pointer"
                  >
                    Back
                  </Button>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={formikProps.isSubmitting || !formikProps.isValid || isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:scale-100 cursor-pointer"
              >
                <span className="font-semibold">
                  {(formikProps.isSubmitting || isSubmitting) ? (
                    'Processing...'
                  ) : isLastStep ? (
                    'Complete Registration'
                  ) : (
                    'Save & Continue'
                  )}
                </span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </Form>
      )}
    </Formik>
  );
};