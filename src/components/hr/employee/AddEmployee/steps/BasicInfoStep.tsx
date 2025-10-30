import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { ProfilePictureUpload } from './ProfileUpload';
import { Input } from '../../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { Gender, EmpType, EmpNature } from '../../../../../types/hr/enum';
import type { Step1Dto } from '../../../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';
import { amharicRegex } from '../../../../../utils/amharic-regex'; // Import the Amharic regex

interface BasicInfoStepProps {
  data: Partial<Step1Dto & { branchId: UUID }>;
  onNext: (data: Step1Dto & { branchId: UUID }) => void;
  onBack: () => void;
}

// Dummy data with proper typing
const dummyBranches = [
  { id: '1' as UUID, name: 'Head Office' },
  { id: '2' as UUID, name: 'Production Facility' },
  { id: '3' as UUID, name: 'Tech Center' },
  { id: '4' as UUID, name: 'R&D Lab' },
  { id: '5' as UUID, name: 'Service Center' },
];

const dummyJobGrades = [
  { id: '1' as UUID, name: 'Grade 1 - Entry Level' },
  { id: '2' as UUID, name: 'Grade 2 - Junior' },
  { id: '3' as UUID, name: 'Grade 3 - Intermediate' },
  { id: '4' as UUID, name: 'Grade 4 - Senior' },
  { id: '5' as UUID, name: 'Grade 5 - Lead' },
  { id: '6' as UUID, name: 'Grade 6 - Manager' },
  { id: '7' as UUID, name: 'Grade 7 - Director' },
];

const dummyDepartments = [
  { id: '1' as UUID, branchId: '1' as UUID, name: 'Human Resources' },
  { id: '2' as UUID, branchId: '1' as UUID, name: 'Finance' },
  { id: '3' as UUID, branchId: '1' as UUID, name: 'IT' },
  { id: '4' as UUID, branchId: '2' as UUID, name: 'Production' },
  { id: '5' as UUID, branchId: '2' as UUID, name: 'Quality Control' },
  { id: '6' as UUID, branchId: '3' as UUID, name: 'Software Development' },
  { id: '7' as UUID, branchId: '3' as UUID, name: 'DevOps' },
  { id: '8' as UUID, branchId: '4' as UUID, name: 'Research' },
  { id: '9' as UUID, branchId: '4' as UUID, name: 'Innovation' },
  { id: '10' as UUID, branchId: '5' as UUID, name: 'Customer Service' },
];

const dummyPositions = [
  { id: '1' as UUID, departmentId: '1' as UUID, name: 'HR Manager' },
  { id: '2' as UUID, departmentId: '1' as UUID, name: 'Recruitment Specialist' },
  { id: '3' as UUID, departmentId: '2' as UUID, name: 'Finance Director' },
  { id: '4' as UUID, departmentId: '2' as UUID, name: 'Accountant' },
  { id: '5' as UUID, departmentId: '3' as UUID, name: 'IT Manager' },
  { id: '6' as UUID, departmentId: '3' as UUID, name: 'System Administrator' },
  { id: '7' as UUID, departmentId: '4' as UUID, name: 'Production Supervisor' },
  { id: '8' as UUID, departmentId: '4' as UUID, name: 'Production Worker' },
  { id: '9' as UUID, departmentId: '5' as UUID, name: 'Quality Analyst' },
  { id: '10' as UUID, departmentId: '6' as UUID, name: 'Senior Developer' },
  { id: '11' as UUID, departmentId: '6' as UUID, name: 'Junior Developer' },
  { id: '12' as UUID, departmentId: '7' as UUID, name: 'DevOps Engineer' },
  { id: '13' as UUID, departmentId: '8' as UUID, name: 'Research Scientist' },
  { id: '14' as UUID, departmentId: '9' as UUID, name: 'Innovation Lead' },
  { id: '15' as UUID, departmentId: '10' as UUID, name: 'Customer Support Agent' },
];

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  firstNameAm: yup.string().required('First name (Amharic) is required'),
  middleName: yup.string().required('Middle name is required'),
  middleNameAm: yup.string().required('Middle name (Amharic) is required'),
  lastName: yup.string().required('Last name is required'),
  lastNameAm: yup.string().required('Last name (Amharic) is required'),
  nationality: yup.string().required('Nationality is required'),
  gender: yup.string().required('Gender is required'),
  employmentDate: yup.string().required('Employment date is required'),
  branchId: yup.string().required('Branch is required'),
  jobGradeId: yup.string().required('Job grade is required'),
  positionId: yup.string().required('Position is required'),
  departmentId: yup.string().required('Department is required'),
  employmentType: yup.string().required('Employment type is required'),
  employmentNature: yup.string().required('Employment nature is required'),
});

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onNext, onBack }) => {
  // Set default employment date to today if not provided
  const getDefaultEmploymentDate = () => {
    return data.employmentDate || new Date().toISOString().split('T')[0];
  };

  const formik = useFormik<Step1Dto & { branchId: UUID }>({
    initialValues: {
      firstName: data.firstName || '',
      firstNameAm: data.firstNameAm || '',
      middleName: data.middleName || '',
      middleNameAm: data.middleNameAm || '',
      lastName: data.lastName || '',
      lastNameAm: data.lastNameAm || '',
      nationality: data.nationality || '',
      gender: data.gender || '' as Gender,
      employmentDate: getDefaultEmploymentDate(),
      branchId: data.branchId || '' as UUID,
      jobGradeId: data.jobGradeId || '' as UUID,
      positionId: data.positionId || '' as UUID,
      departmentId: data.departmentId || '' as UUID,
      employmentType: data.employmentType || '' as EmpType,
      employmentNature: data.employmentNature || '' as EmpNature,
      File: data.File || null,
    },
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  // Amharic input handlers
  const handleAmharicInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value;
    if (value === '' || amharicRegex.test(value)) {
      formik.setFieldValue(fieldName, value);
    }
  };

  const handleProfilePictureSelect = (file: File) => {
    formik.setFieldValue('File', file);
  };

  const handleProfilePictureRemove = () => {
    formik.setFieldValue('File', null);
  };

  // Filter departments based on selected branch
  const filteredDepartments = dummyDepartments.filter(
    department => department.branchId === formik.values.branchId
  );

  // Filter positions based on selected department
  const filteredPositions = dummyPositions.filter(
    position => position.departmentId === formik.values.departmentId
  );

  // Reset dependent fields when parent field changes
  const handleBranchChange = (value: UUID) => {
    formik.setFieldValue('branchId', value);
    formik.setFieldValue('departmentId', '');
    formik.setFieldValue('positionId', '');
  };

  const handleDepartmentChange = (value: UUID) => {
    formik.setFieldValue('departmentId', value);
    formik.setFieldValue('positionId', '');
  };

  // Smart form validation that works with pre-filled data
  const isFormValid = React.useMemo(() => {
    if (!formik.isValid) return false;
    
    // Check if all required fields have values (for pre-filled forms)
    const hasAllRequiredFields = 
      formik.values.firstName &&
      formik.values.firstNameAm &&
      formik.values.middleName &&
      formik.values.middleNameAm &&
      formik.values.lastName &&
      formik.values.lastNameAm &&
      formik.values.nationality &&
      formik.values.gender &&
      formik.values.employmentDate &&
      formik.values.branchId &&
      formik.values.jobGradeId &&
      formik.values.positionId &&
      formik.values.departmentId &&
      formik.values.employmentType &&
      formik.values.employmentNature;

    return formik.dirty || hasAllRequiredFields;
  }, [formik.isValid, formik.dirty, formik.values]);

  // Helper function to safely get error messages
  const getErrorMessage = (fieldName: string): string => {
    const error = formik.errors[fieldName as keyof typeof formik.errors];
    const touched = formik.touched[fieldName as keyof typeof formik.touched];
    
    if (touched && error) {
      return typeof error === 'string' ? error : 'Invalid value';
    }
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <ProfilePictureUpload
            profilePicture={formik.values.File}
            onProfilePictureSelect={handleProfilePictureSelect}
            onProfilePictureRemove={handleProfilePictureRemove}
          />
        </div>

        {/* Personal Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h3>
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
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('firstName') ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John"
            />
            {getErrorMessage('firstName') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('firstName')}</div>
            )}
          </div>

          {/* ስም */}
          <div className="space-y-2">
            <label htmlFor="firstNameAm" className="block text-sm font-medium text-gray-700 mb-1">
              ስም *
            </label>
            <Input
              id="firstNameAm"
              name="firstNameAm"
              type="text"
              value={formik.values.firstNameAm}
              onChange={(e) => handleAmharicInputChange(e, 'firstNameAm')}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('firstNameAm') ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="አየለ"
            />
            {getErrorMessage('firstNameAm') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('firstNameAm')}</div>
            )}
          </div>

          {/* Middle Name (English) */}
          <div className="space-y-2">
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name (English) *
            </label>
            <Input
              id="middleName"
              name="middleName"
              type="text"
              value={formik.values.middleName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('middleName') ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Michael"
            />
            {getErrorMessage('middleName') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('middleName')}</div>
            )}
          </div>

          {/* የአባት ስም */}
          <div className="space-y-2">
            <label htmlFor="middleNameAm" className="block text-sm font-medium text-gray-700 mb-1">
              የአባት ስም *
            </label>
            <Input
              id="middleNameAm"
              name="middleNameAm"
              type="text"
              value={formik.values.middleNameAm}
              onChange={(e) => handleAmharicInputChange(e, 'middleNameAm')}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('middleNameAm') ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="በቀለ"
            />
            {getErrorMessage('middleNameAm') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('middleNameAm')}</div>
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
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('lastName') ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Doe"
            />
            {getErrorMessage('lastName') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('lastName')}</div>
            )}
          </div>

          {/* የአያት ስም */}
          <div className="space-y-2">
            <label htmlFor="lastNameAm" className="block text-sm font-medium text-gray-700 mb-1">
              የአያት ስም *
            </label>
            <Input
              id="lastNameAm"
              name="lastNameAm"
              type="text"
              value={formik.values.lastNameAm}
              onChange={(e) => handleAmharicInputChange(e, 'lastNameAm')}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('lastNameAm') ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="ዮሐንስ"
            />
            {getErrorMessage('lastNameAm') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('lastNameAm')}</div>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <Select
              value={formik.values.gender}
              onValueChange={(value: Gender) => formik.setFieldValue('gender', value)}
            >
              <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('gender') ? "border-red-500" : "border-gray-300"
              }`}>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Gender).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getErrorMessage('gender') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('gender')}</div>
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
              value={formik.values.nationality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                getErrorMessage('nationality') ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ethiopian"
            />
            {getErrorMessage('nationality') && (
              <div className="text-red-500 text-xs mt-1">{getErrorMessage('nationality')}</div>
            )}
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-800">Employment Details</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Employment Date */}
            <div className="space-y-2">
              <label htmlFor="employmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                Employment Date <span className="text-red-500">*</span>
              </label>
              <input
                id="employmentDate"
                name="employmentDate"
                type="date"
                value={formik.values.employmentDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('employmentDate') ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {getErrorMessage('employmentDate') && (
                <p className="text-red-500 text-sm mt-1">{getErrorMessage('employmentDate')}</p>
              )}
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
                Branch *
              </label>
              <Select
                value={formik.values.branchId}
                onValueChange={handleBranchChange}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('branchId') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {dummyBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('branchId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('branchId')}</div>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <Select
                value={formik.values.departmentId}
                onValueChange={handleDepartmentChange}
                disabled={!formik.values.branchId}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('departmentId') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder={
                    !formik.values.branchId ? "Select Branch First" : "Select Department"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                  {filteredDepartments.length === 0 && formik.values.branchId && (
                    <SelectItem value="no-departments" disabled>
                      No departments available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {getErrorMessage('departmentId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('departmentId')}</div>
              )}
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <Select
                value={formik.values.positionId}
                onValueChange={(value: UUID) => formik.setFieldValue('positionId', value)}
                disabled={!formik.values.departmentId}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('positionId') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder={
                    !formik.values.departmentId ? "Select Department First" : "Select Position"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredPositions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  ))}
                  {filteredPositions.length === 0 && formik.values.departmentId && (
                    <SelectItem value="no-positions" disabled>
                      No positions available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {getErrorMessage('positionId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('positionId')}</div>
              )}
            </div>

            {/* Job Grade */}
            <div className="space-y-2">
              <label htmlFor="jobGradeId" className="block text-sm font-medium text-gray-700 mb-1">
                Job Grade *
              </label>
              <Select
                value={formik.values.jobGradeId}
                onValueChange={(value: UUID) => formik.setFieldValue('jobGradeId', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('jobGradeId') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select Job Grade" />
                </SelectTrigger>
                <SelectContent>
                  {dummyJobGrades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('jobGradeId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('jobGradeId')}</div>
              )}
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type *
              </label>
              <Select
                value={formik.values.employmentType}
                onValueChange={(value: EmpType) => formik.setFieldValue('employmentType', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('employmentType') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EmpType).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('employmentType') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('employmentType')}</div>
              )}
            </div>

            {/* Employment Nature */}
            <div className="space-y-2">
              <label htmlFor="employmentNature" className="block text-sm font-medium text-gray-700 mb-1">
                Employment Nature *
              </label>
              <Select
                value={formik.values.employmentNature}
                onValueChange={(value: EmpNature) => formik.setFieldValue('employmentNature', value)}
              >
                <SelectTrigger className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                  getErrorMessage('employmentNature') ? "border-red-500" : "border-gray-300"
                }`}>
                  <SelectValue placeholder="Select Employment Nature" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EmpNature).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('employmentNature') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('employmentNature')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};