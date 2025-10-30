import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { ProfilePictureUpload } from './ProfileUpload';
import { Input } from '../../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { Gender, EmpType, EmpNature } from '../../../../../types/hr/enum';
import type { Step1Dto } from '../../../../../types/hr/employee/empAddDto';
import type { UUID } from 'crypto';
import { amharicRegex } from '../../../../../utils/amharic-regex';
import List from '../../../../List/list';
import { branchService } from '../../../../../services/core/branchservice';
import { departmentService } from '../../../../../services/core/deptservice';
import { positionService } from '../../../../../services/hr/settings/positionService';
import { jobGradeService } from '../../../../../services/hr/settings/JobGradeServives';
import type { ListItem } from '../../../../../types/List/list';
import type { BranchCompListDto } from '../../../../../types/core/branch';
import type { NameListDto } from '../../../../../types/hr/NameListDto';
import type { PositionListDto } from '../../../../../types/hr/position';
import type { JobGradeListDto } from '../../../../../types/hr/jobgrade';

interface BasicInfoStepProps {
  data: Partial<Step1Dto & { branchId: UUID }>;
  onNext: (data: Step1Dto & { branchId: UUID }) => void;
  onBack: () => void;
}

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
  // branchId: yup.string().required('Branch is required'),
  // jobGradeId: yup.string().required('Job grade is required'),
  // positionId: yup.string().required('Position is required'),
  // departmentId: yup.string().required('Department is required'),
  employmentType: yup.string().required('Employment type is required'),
  employmentNature: yup.string().required('Employment nature is required'),
});

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onNext, onBack }) => {
  const [branches, setBranches] = useState<BranchCompListDto[]>([]);
  const [departments, setDepartments] = useState<NameListDto[]>([]);
  const [positions, setPositions] = useState<PositionListDto[]>([]);
  const [jobGrades, setJobGrades] = useState<JobGradeListDto[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [loadingJobGrades, setLoadingJobGrades] = useState(false);

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

  // Fetch branches when component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const branchesData = await branchService.getBranchCompanyList();
        setBranches(branchesData);
        
        // Auto-select first branch if none is selected and we have branches
        if (!formik.values.branchId && branchesData.length > 0) {
          formik.setFieldValue('branchId', branchesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const departmentsData = await departmentService.getAllDepartments();
        setDepartments(departmentsData);
        
        // Auto-select first department if none is selected and we have departments
        if (!formik.values.departmentId && departmentsData.length > 0) {
          formik.setFieldValue('departmentId', departmentsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch positions when component mounts
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoadingPositions(true);
        const positionsData = await positionService.getAllPositions();
        setPositions(positionsData);
        
        // Auto-select first position if none is selected and we have positions
        if (!formik.values.positionId && positionsData.length > 0) {
          formik.setFieldValue('positionId', positionsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      } finally {
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, []);

  // Fetch job grades when component mounts
  useEffect(() => {
    const fetchJobGrades = async () => {
      try {
        setLoadingJobGrades(true);
        const jobGradesData = await jobGradeService.getAllJobGrades();
        setJobGrades(jobGradesData);
        
        // Auto-select first job grade if none is selected and we have job grades
        if (!formik.values.jobGradeId && jobGradesData.length > 0) {
          formik.setFieldValue('jobGradeId', jobGradesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching job grades:', error);
      } finally {
        setLoadingJobGrades(false);
      }
    };

    fetchJobGrades();
  }, []);

  // Convert branches to ListItem format
  const branchListItems: ListItem[] = branches.map(branch => ({
    id: branch.id,
    name: branch.name
  }));

  // Convert departments to ListItem format
  const departmentListItems: ListItem[] = departments.map(dept => ({
    id: dept.id,
    name: dept.name
  }));

  // Convert positions to ListItem format
  const positionListItems: ListItem[] = positions.map(position => ({
    id: position.id,
    name: position.name
  }));

  // Convert job grades to ListItem format
  const jobGradeListItems: ListItem[] = jobGrades.map(grade => ({
    id: grade.id,
    name: grade.name
  }));

  // Handle branch selection
  const handleBranchSelect = (item: ListItem) => {
    formik.setFieldValue('branchId', item.id);
  };

  // Handle department selection
  const handleDepartmentSelect = (item: ListItem) => {
    formik.setFieldValue('departmentId', item.id);
  };

  // Handle position selection
  const handlePositionSelect = (item: ListItem) => {
    formik.setFieldValue('positionId', item.id);
  };

  // Handle job grade selection
  const handleJobGradeSelect = (item: ListItem) => {
    formik.setFieldValue('jobGradeId', item.id);
  };

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

  // Simplified form validation - only check if form is valid
  const isFormValid = React.useMemo(() => {
    return formik.isValid;
  }, [formik.isValid]);

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

            {/* Branch - Using List Component */}
            <div className="space-y-2">
              <List
                items={branchListItems}
                selectedValue={formik.values.branchId}
                onSelect={handleBranchSelect}
                label="Select Branch"
                placeholder="Select a branch"
                // required
                disabled={loadingBranches}
              />
              {loadingBranches && (
                <p className="text-sm text-gray-500">Loading branches...</p>
              )}
              {getErrorMessage('branchId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('branchId')}</div>
              )}
            </div>

            {/* Department - Using List Component */}
            <div className="space-y-2">
              <List
                items={departmentListItems}
                selectedValue={formik.values.departmentId}
                onSelect={handleDepartmentSelect}
                label="Select Department"
                placeholder="Select a department"
                // required
                disabled={loadingDepartments}
              />
              {loadingDepartments && (
                <p className="text-sm text-gray-500">Loading departments...</p>
              )}
              {getErrorMessage('departmentId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('departmentId')}</div>
              )}
            </div>

            {/* Position - Using List Component */}
            <div className="space-y-2">
              <List
                items={positionListItems}
                selectedValue={formik.values.positionId}
                onSelect={handlePositionSelect}
                label="Select Position"
                placeholder="Select a position"
                // required
                disabled={loadingPositions}
              />
              {loadingPositions && (
                <p className="text-sm text-gray-500">Loading positions...</p>
              )}
              {getErrorMessage('positionId') && (
                <div className="text-red-500 text-xs mt-1">{getErrorMessage('positionId')}</div>
              )}
            </div>

            {/* Job Grade - Using List Component */}
            <div className="space-y-2">
              <List
                items={jobGradeListItems}
                selectedValue={formik.values.jobGradeId}
                onSelect={handleJobGradeSelect}
                label="Select Job Grade"
                placeholder="Select a job grade"
                // required
                disabled={loadingJobGrades}
              />
              {loadingJobGrades && (
                <p className="text-sm text-gray-500">Loading job grades...</p>
              )}
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