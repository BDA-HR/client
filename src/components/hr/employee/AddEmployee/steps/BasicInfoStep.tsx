import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { ProfilePictureUpload } from './ProfileUpload';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { Gender, EmpType, EmpNature } from '../../../../../types/hr/enum';

interface BasicInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

// Dummy data
const dummyCompanies = [
  { id: '1', name: 'Main Company HQ' },
  { id: '2', name: 'Tech Solutions Inc.' },
  { id: '3', name: 'Global Services Ltd.' },
];

const dummyBranches = [
  { id: '1', companyId: '1', name: 'Head Office' },
  { id: '2', companyId: '1', name: 'Production Facility' },
  { id: '3', companyId: '2', name: 'Tech Center' },
  { id: '4', companyId: '2', name: 'R&D Lab' },
  { id: '5', companyId: '3', name: 'Service Center' },
];

const dummyJobGrades = [
  { id: '1', name: 'Grade 1 - Entry Level' },
  { id: '2', name: 'Grade 2 - Junior' },
  { id: '3', name: 'Grade 3 - Intermediate' },
  { id: '4', name: 'Grade 4 - Senior' },
  { id: '5', name: 'Grade 5 - Lead' },
  { id: '6', name: 'Grade 6 - Manager' },
  { id: '7', name: 'Grade 7 - Director' },
];

const dummyDepartments = [
  { id: '1', branchId: '1', name: 'Human Resources' },
  { id: '2', branchId: '1', name: 'Finance' },
  { id: '3', branchId: '1', name: 'IT' },
  { id: '4', branchId: '2', name: 'Production' },
  { id: '5', branchId: '2', name: 'Quality Control' },
  { id: '6', branchId: '3', name: 'Software Development' },
  { id: '7', branchId: '3', name: 'DevOps' },
  { id: '8', branchId: '4', name: 'Research' },
  { id: '9', branchId: '4', name: 'Innovation' },
  { id: '10', branchId: '5', name: 'Customer Service' },
];

const dummyPositions = [
  { id: '1', departmentId: '1', name: 'HR Manager' },
  { id: '2', departmentId: '1', name: 'Recruitment Specialist' },
  { id: '3', departmentId: '2', name: 'Finance Director' },
  { id: '4', departmentId: '2', name: 'Accountant' },
  { id: '5', departmentId: '3', name: 'IT Manager' },
  { id: '6', departmentId: '3', name: 'System Administrator' },
  { id: '7', departmentId: '4', name: 'Production Supervisor' },
  { id: '8', departmentId: '4', name: 'Production Worker' },
  { id: '9', departmentId: '5', name: 'Quality Analyst' },
  { id: '10', departmentId: '6', name: 'Senior Developer' },
  { id: '11', departmentId: '6', name: 'Junior Developer' },
  { id: '12', departmentId: '7', name: 'DevOps Engineer' },
  { id: '13', departmentId: '8', name: 'Research Scientist' },
  { id: '14', departmentId: '9', name: 'Innovation Lead' },
  { id: '15', departmentId: '10', name: 'Customer Support Agent' },
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
  companyId: yup.string().required('Company is required'),
  branchId: yup.string().required('Branch is required'),
  jobGradeId: yup.string().required('Job grade is required'),
  positionId: yup.string().required('Position is required'),
  departmentId: yup.string().required('Department is required'),
  employmentType: yup.string().required('Employment type is required'),
  employmentNature: yup.string().required('Employment nature is required'),
});

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onNext, onBack }) => {
  const formik = useFormik({
    initialValues: {
      firstName: data.firstName || '',
      firstNameAm: data.firstNameAm || '',
      middleName: data.middleName || '',
      middleNameAm: data.middleNameAm || '',
      lastName: data.lastName || '',
      lastNameAm: data.lastNameAm || '',
      nationality: data.nationality || '',
      gender: data.gender || '',
      employmentDate: data.employmentDate || '',
      companyId: data.companyId || '',
      branchId: data.branchId || '',
      jobGradeId: data.jobGradeId || '',
      positionId: data.positionId || '',
      departmentId: data.departmentId || '',
      employmentType: data.employmentType || '',
      employmentNature: data.employmentNature || '',
      File: data.File || null,
    },
    validationSchema,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  const handleProfilePictureSelect = (file: File) => {
    formik.setFieldValue('File', file);
  };

  const handleProfilePictureRemove = () => {
    formik.setFieldValue('File', null);
  };

  // Filter branches based on selected company
  const filteredBranches = dummyBranches.filter(
    branch => branch.companyId === formik.values.companyId
  );

  // Filter departments based on selected branch
  const filteredDepartments = dummyDepartments.filter(
    department => department.branchId === formik.values.branchId
  );

  // Filter positions based on selected department
  const filteredPositions = dummyPositions.filter(
    position => position.departmentId === formik.values.departmentId
  );

  // Reset dependent fields when parent field changes
  const handleCompanyChange = (value: string) => {
    formik.setFieldValue('companyId', value);
    formik.setFieldValue('branchId', '');
    formik.setFieldValue('departmentId', '');
    formik.setFieldValue('positionId', '');
  };

  const handleBranchChange = (value: string) => {
    formik.setFieldValue('branchId', value);
    formik.setFieldValue('departmentId', '');
    formik.setFieldValue('positionId', '');
  };

  const handleDepartmentChange = (value: string) => {
    formik.setFieldValue('departmentId', value);
    formik.setFieldValue('positionId', '');
  };

  const isFormValid = formik.isValid && formik.dirty;

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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
          <div className="flex justify-center">
            <ProfilePictureUpload
              profilePicture={formik.values.File}
              onProfilePictureSelect={handleProfilePictureSelect}
              onProfilePictureRemove={handleProfilePictureRemove}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Names */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">English Names</h4>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('firstName') ? 'border-red-500' : ''}
                />
                {getErrorMessage('firstName') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('firstName')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name *</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('middleName') ? 'border-red-500' : ''}
                />
                {getErrorMessage('middleName') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('middleName')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('lastName') ? 'border-red-500' : ''}
                />
                {getErrorMessage('lastName') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('lastName')}</div>
                )}
              </div>
            </div>

            {/* Amharic Names */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Amharic Names</h4>
              
              <div className="space-y-2">
                <Label htmlFor="firstNameAm">First Name (Amharic) *</Label>
                <Input
                  id="firstNameAm"
                  name="firstNameAm"
                  value={formik.values.firstNameAm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('firstNameAm') ? 'border-red-500' : ''}
                />
                {getErrorMessage('firstNameAm') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('firstNameAm')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleNameAm">Middle Name (Amharic) *</Label>
                <Input
                  id="middleNameAm"
                  name="middleNameAm"
                  value={formik.values.middleNameAm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('middleNameAm') ? 'border-red-500' : ''}
                />
                {getErrorMessage('middleNameAm') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('middleNameAm')}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastNameAm">Last Name (Amharic) *</Label>
                <Input
                  id="lastNameAm"
                  name="lastNameAm"
                  value={formik.values.lastNameAm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getErrorMessage('lastNameAm') ? 'border-red-500' : ''}
                />
                {getErrorMessage('lastNameAm') && (
                  <div className="text-red-500 text-sm">{getErrorMessage('lastNameAm')}</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('nationality') ? 'border-red-500' : ''}
              />
              {getErrorMessage('nationality') && (
                <div className="text-red-500 text-sm">{getErrorMessage('nationality')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formik.values.gender}
                onValueChange={(value) => formik.setFieldValue('gender', value)}
              >
                <SelectTrigger className={getErrorMessage('gender') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
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
                <div className="text-red-500 text-sm">{getErrorMessage('gender')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Employment Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="employmentDate">Employment Date *</Label>
              <Input
                id="employmentDate"
                name="employmentDate"
                type="date"
                value={formik.values.employmentDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getErrorMessage('employmentDate') ? 'border-red-500' : ''}
              />
              {getErrorMessage('employmentDate') && (
                <div className="text-red-500 text-sm">{getErrorMessage('employmentDate')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyId">Company *</Label>
              <Select
                value={formik.values.companyId}
                onValueChange={handleCompanyChange}
              >
                <SelectTrigger className={getErrorMessage('companyId') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {dummyCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('companyId') && (
                <div className="text-red-500 text-sm">{getErrorMessage('companyId')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchId">Branch *</Label>
              <Select
                value={formik.values.branchId}
                onValueChange={handleBranchChange}
                disabled={!formik.values.companyId}
              >
                <SelectTrigger className={getErrorMessage('branchId') ? 'border-red-500' : ''}>
                  <SelectValue placeholder={formik.values.companyId ? "Select branch" : "Select company first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('branchId') && (
                <div className="text-red-500 text-sm">{getErrorMessage('branchId')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Department *</Label>
              <Select
                value={formik.values.departmentId}
                onValueChange={handleDepartmentChange}
                disabled={!formik.values.branchId}
              >
                <SelectTrigger className={getErrorMessage('departmentId') ? 'border-red-500' : ''}>
                  <SelectValue placeholder={formik.values.branchId ? "Select department" : "Select branch first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('departmentId') && (
                <div className="text-red-500 text-sm">{getErrorMessage('departmentId')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionId">Position *</Label>
              <Select
                value={formik.values.positionId}
                onValueChange={(value) => formik.setFieldValue('positionId', value)}
                disabled={!formik.values.departmentId}
              >
                <SelectTrigger className={getErrorMessage('positionId') ? 'border-red-500' : ''}>
                  <SelectValue placeholder={formik.values.departmentId ? "Select position" : "Select department first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredPositions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getErrorMessage('positionId') && (
                <div className="text-red-500 text-sm">{getErrorMessage('positionId')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobGradeId">Job Grade *</Label>
              <Select
                value={formik.values.jobGradeId}
                onValueChange={(value) => formik.setFieldValue('jobGradeId', value)}
              >
                <SelectTrigger className={getErrorMessage('jobGradeId') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select job grade" />
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
                <div className="text-red-500 text-sm">{getErrorMessage('jobGradeId')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type *</Label>
              <Select
                value={formik.values.employmentType}
                onValueChange={(value) => formik.setFieldValue('employmentType', value)}
              >
                <SelectTrigger className={getErrorMessage('employmentType') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select employment type" />
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
                <div className="text-red-500 text-sm">{getErrorMessage('employmentType')}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentNature">Employment Nature *</Label>
              <Select
                value={formik.values.employmentNature}
                onValueChange={(value) => formik.setFieldValue('employmentNature', value)}
              >
                <SelectTrigger className={getErrorMessage('employmentNature') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select employment nature" />
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
                <div className="text-red-500 text-sm">{getErrorMessage('employmentNature')}</div>
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