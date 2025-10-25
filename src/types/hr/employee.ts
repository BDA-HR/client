import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';
export type { UUID }

export interface EmployeeListDto extends BaseDto {
  personId: UUID;
  jobGradeId: UUID;
  positionId: UUID;
  departmentId: UUID;
  employmentTypeId: UUID;
  employmentNatureId: UUID;
  gender: '0' | '1'; 
  nationality: string;
  code: string;
  employmentDate: string;
  jobGrade: string;
  position: string;
  department: string;
  employmentType: string;
  employmentNature: string;
  genderStr: string;
  empFullName: string;
  empFullNameAm: string;
  employmentDateStr: string;
  employmentDateStrAm: string;
}

export interface EmployeeAddDto {
  firstName: string;
  firstNameAm: string;
  middleName: string;
  middleNameAm: string;
  lastName: string;
  lastNameAm: string;
  gender: '0' | '1';
  nationality: string;
  employmentDate: string;
  jobGradeId: UUID;
  positionId: UUID;
  departmentId: UUID;
  employmentTypeId: UUID;
  employmentNatureId: UUID;
}

export interface EmployeeModDto {
  id: UUID;
  firstName: string;
  firstNameAm: string;
  middleName: string;
  middleNameAm: string;
  lastName: string;
  lastNameAm: string;
  gender: '0' | '1';
  nationality: string;
  employmentDate: string;
  personId: UUID;
  jobGradeId: UUID;
  positionId: UUID;
  departmentId: UUID;
  employmentTypeId: UUID;
  employmentNatureId: UUID;
  rowVersion: string;
}

// Related types for dropdowns
export interface JobGradeDto {
  id: UUID;
  name: string;
  nameAm: string;
}

export interface PositionDto {
  id: UUID;
  name: string;
  nameAm: string;
}

export interface DepartmentDto {
  id: UUID;
  name: string;
  nameAm: string;
}

export interface EmploymentTypeDto {
  id: UUID;
  name: string;
  nameAm: string;
}

export interface EmploymentNatureDto {
  id: UUID;
  name: string;
  nameAm: string;
}

// Additional DTOs
export interface EmContactAddDto {
  firstName: string;
  firstNameAm: string;
  middleName: string;
  middleNameAm: string;
  lastName: string;
  lastNameAm: string;
  nationality: string;
  gender: '0' | '1';
  relationId: UUID;
  addressId: UUID;
  employeeId: UUID;
}

export interface EmpBioAddDto {
  birthDate: string;
  birthLocation: string;
  motherFullName: string;
  hasBirthCert: '0' | '1';
  hasMarriageCert: '0' | '1';
  maritalStatusId: UUID;
  addressId: UUID;
  employeeId: UUID;
}

export interface EmpFamilyAddDto {
  firstName: string;
  firstNameAm: string;
  middleName: string;
  middleNameAm: string;
  lastName: string;
  lastNameAm: string;
  gender: '0' | '1';
  nationality: string;
  relationId: UUID;
  employeeId: UUID;
}

export interface EmpFinanceAddDto {
  tin: string;
  bankAccountNo: string;
  pensionNumber: string;
  employeeId: UUID;
}

export interface EmpGuarantorAddDto {
  firstName: string;
  firstNameAm: string;
  middleName: string;
  middleNameAm: string;
  lastName: string;
  lastNameAm: string;
  gender: '0' | '1';
  nationality: string;
  addressId: UUID;
  relationId: UUID;
  employeeId: UUID;
}

export interface EmpPensionCardAddDto {
  registrationDate: string;
  sentDate?: string;
  receivedDate?: string;
  isReceived: '0' | '1';
  isSent: '0' | '1';
  employeeId: UUID;
}

export interface EmpStateAddDto {
  isTerminated: '0' | '1';
  isApproved: '0' | '1';
  isStandBy: '0' | '1';
  isRetired: '0' | '1';
  isUnderProbation: '0' | '1';
  employeeId: UUID;
}

// Lookup types
export interface MaritalStatusDto {
  id: UUID;
  name: string;
  nameAm: string;
}

export interface RelationDto {
  id: UUID;
  name: string;
  nameAm: string;
}

export interface AddressDto {
  id: UUID;
  name: string;
  nameAm: string;
  fullAddress: string;
}

// Filter types
export interface EmployeeFilters {
  searchTerm: string;
  departmentId?: UUID;
  positionId?: UUID;
  jobGradeId?: UUID;
  employmentTypeId?: UUID;
  employmentNatureId?: UUID;
  gender: '0' | '1' | '';
}

export interface EmployeeDetailsData {
  employee: EmployeeListDto;
}