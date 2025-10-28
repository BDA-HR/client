// components/hr/employee/AddEmployee/steps/BasicInfoStep.tsx
import React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import { Input } from "../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import type {
  JobGradeDto,
  DepartmentDto,
  PositionDto,
} from "../../../../../types/hr/employee";
import type { ExtendedEmployeeData } from "../AddEmployeeStepForm";
import { amharicRegex } from "../../../../../utils/amharic-regex";
import { ProfilePictureUpload } from "./ProfileUpload";

interface BasicInfoStepProps {
  formikProps: FormikProps<ExtendedEmployeeData>;
  mockCompanies: any[];
  mockBranches: any[];
  mockJobGrades: JobGradeDto[];
  mockDepartments: DepartmentDto[];
  mockPositions: PositionDto[];
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formikProps,
  mockCompanies,
  mockBranches,
  mockJobGrades,
  mockDepartments,
  mockPositions,
}) => {
  const { errors, touched, values, handleChange, handleBlur, setFieldValue } = formikProps;

  const inputClassName = (fieldName: string) =>
    `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
      getNestedError(errors, fieldName) && getNestedTouched(touched, fieldName)
        ? "border-red-500"
        : "border-gray-300"
    }`;

  const selectTriggerClassName = (fieldName: string) =>
    `w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
      getNestedError(errors, fieldName) && getNestedTouched(touched, fieldName)
        ? "border-red-500"
        : "border-gray-300"
    }`;

  const getNestedError = (errorObj: any, path: string) => {
    return path.split(".").reduce((obj, key) => obj && obj[key], errorObj);
  };

  const getNestedTouched = (touchedObj: any, path: string) => {
    return path.split(".").reduce((obj, key) => obj && obj[key], touchedObj);
  };

  const handleAmharicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value;
    if (value === "" || amharicRegex.test(value)) {
      setFieldValue(fieldName, value);
    }
  };

  const handleProfilePictureSelect = (file: File) => {
    setFieldValue("profilePicture", file);
  };

  const handleProfilePictureRemove = () => {
    setFieldValue("profilePicture", null);
  };

  const filteredBranches = values.companyId
    ? mockBranches.filter((branch) => branch.companyId === values.companyId)
    : [];
  const filteredDepartments = values.branchId
    ? mockDepartments.filter((dept) => dept.branchId === values.branchId)
    : [];
  const filteredPositions = values.departmentId
    ? mockPositions.filter((position) => position.departmentId === values.departmentId)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-8">
        <ProfilePictureUpload
          profilePicture={values.profilePicture}
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
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName("firstName")}
            placeholder="John"
          />
          {errors.firstName && touched.firstName && (
            <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
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
            value={values.firstNameAm}
            onChange={(e) => handleAmharicChange(e, "firstNameAm")}
            onBlur={handleBlur}
            className={inputClassName("firstNameAm")}
            placeholder="አየለ"
          />
          {errors.firstNameAm && touched.firstNameAm && (
            <div className="text-red-500 text-xs mt-1">{errors.firstNameAm}</div>
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

        {/* የአባት ስም */}
        <div className="space-y-2">
          <label htmlFor="middleNameAm" className="block text-sm font-medium text-gray-700 mb-1">
            የአባት ስም
          </label>
          <Input
            id="middleNameAm"
            name="middleNameAm"
            type="text"
            value={values.middleNameAm}
            onChange={(e) => handleAmharicChange(e, "middleNameAm")}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-green-500 focus:outline-2 rounded-md"
            placeholder="በቀለ"
          />
          {errors.middleNameAm && touched.middleNameAm && (
            <div className="text-red-500 text-xs mt-1">{errors.middleNameAm}</div>
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
            className={inputClassName("lastName")}
            placeholder="Doe"
          />
          {errors.lastName && touched.lastName && (
            <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
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
            value={values.lastNameAm}
            onChange={(e) => handleAmharicChange(e, "lastNameAm")}
            onBlur={handleBlur}
            className={inputClassName("lastNameAm")}
            placeholder="ዮሐንስ"
          />
          {errors.lastNameAm && touched.lastNameAm && (
            <div className="text-red-500 text-xs mt-1">{errors.lastNameAm}</div>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <Select
            value={values.gender}
            onValueChange={(value) => setFieldValue("gender", value)}
          >
            <SelectTrigger className={selectTriggerClassName("gender")}>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Male</SelectItem>
              <SelectItem value="1">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && touched.gender && (
            <div className="text-red-500 text-xs mt-1">{errors.gender}</div>
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
            className={inputClassName("nationality")}
            placeholder="Ethiopian"
          />
          {errors.nationality && touched.nationality && (
            <div className="text-red-500 text-xs mt-1">{errors.nationality}</div>
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
              value={values.employmentDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded-md transition-colors duration-200 ${
                errors.employmentDate && touched.employmentDate
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {errors.employmentDate && touched.employmentDate && (
              <p className="text-red-500 text-sm mt-1">{errors.employmentDate}</p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <Select
              value={values.companyId}
              onValueChange={(value) => {
                setFieldValue("companyId", value);
                setFieldValue("branchId", "");
                setFieldValue("departmentId", "");
                setFieldValue("positionId", "");
              }}
            >
              <SelectTrigger className={selectTriggerClassName("companyId")}>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.companyId && touched.companyId && (
              <div className="text-red-500 text-xs mt-1">{errors.companyId}</div>
            )}
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
              Branch *
            </label>
            <Select
              value={values.branchId}
              onValueChange={(value) => {
                setFieldValue("branchId", value);
                setFieldValue("departmentId", "");
                setFieldValue("positionId", "");
              }}
              disabled={!values.companyId}
            >
              <SelectTrigger className={selectTriggerClassName("branchId")}>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {filteredBranches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branchId && touched.branchId && (
              <div className="text-red-500 text-xs mt-1">{errors.branchId}</div>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <Select
              value={values.departmentId}
              onValueChange={(value) => {
                setFieldValue("departmentId", value);
                setFieldValue("positionId", "");
              }}
              disabled={!values.branchId}
            >
              <SelectTrigger className={selectTriggerClassName("departmentId")}>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {filteredDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departmentId && touched.departmentId && (
              <div className="text-red-500 text-xs mt-1">{errors.departmentId}</div>
            )}
          </div>

          {/* Position */}
          <div className="space-y-2">
            <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <Select
              value={values.positionId}
              onValueChange={(value) => setFieldValue("positionId", value)}
              disabled={!values.departmentId}
            >
              <SelectTrigger className={selectTriggerClassName("positionId")}>
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                {filteredPositions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.positionId && touched.positionId && (
              <div className="text-red-500 text-xs mt-1">{errors.positionId}</div>
            )}
          </div>

          {/* Job Grade */}
          <div className="space-y-2">
            <label htmlFor="jobGradeId" className="block text-sm font-medium text-gray-700 mb-1">
              Job Grade *
            </label>
            <Select
              value={values.jobGradeId}
              onValueChange={(value) => setFieldValue("jobGradeId", value)}
            >
              <SelectTrigger className={selectTriggerClassName("jobGradeId")}>
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
              <div className="text-red-500 text-xs mt-1">{errors.jobGradeId}</div>
            )}
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type *
            </label>
            <Select
              value={values.employmentType}
              onValueChange={(value) => setFieldValue("employmentType", value)}
            >
              <SelectTrigger className={selectTriggerClassName("employmentType")}>
                <SelectValue placeholder="Select Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Replacement</SelectItem>
                <SelectItem value="1">New Opening</SelectItem>
                <SelectItem value="2">Additional Required</SelectItem>
                <SelectItem value="3">Old Employee</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentType && touched.employmentType && (
              <div className="text-red-500 text-xs mt-1">{errors.employmentType}</div>
            )}
          </div>

          {/* Employment Nature */}
          <div className="space-y-2">
            <label htmlFor="employmentNature" className="block text-sm font-medium text-gray-700 mb-1">
              Employment Nature *
            </label>
            <Select
              value={values.employmentNature}
              onValueChange={(value) => setFieldValue("employmentNature", value)}
            >
              <SelectTrigger className={selectTriggerClassName("employmentNature")}>
                <SelectValue placeholder="Select Employment Nature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Permanent</SelectItem>
                <SelectItem value="1">Contract</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentNature && touched.employmentNature && (
              <div className="text-red-500 text-xs mt-1">{errors.employmentNature}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};