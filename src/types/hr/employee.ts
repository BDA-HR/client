import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export interface EmployeeListDto extends BaseDto {
  personId: UUID;
  jobGradeId: UUID;
  positionId: UUID;
  departmentId: UUID;
  employmentTypeId: UUID;
  employmentNatureId: UUID;
  gender: '0' | '1' ;
  nationality: string;
  code: string;
  employmentDate: string; // ISO string from DateTime
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
  gender: '0' | '1' ;
  nationality: string;
  employmentDate: string; // ISO string from DateTime
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
  gender: '0' | '1' ; 
  nationality: string;
  employmentDate: string; // ISO string from DateTime
  personId: UUID;
  jobGradeId: UUID;
  positionId: UUID;
  departmentId: UUID;
  employmentTypeId: UUID;
  employmentNatureId: UUID;
  rowVersion: string;
}

// You might also want these related types for dropdowns/selects
export interface JobGradeDto {
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

// Filter types for employee lists
export interface EmployeeFilters {
  searchTerm: string;
  departmentId?: UUID;
  positionId?: UUID;
  jobGradeId?: UUID;
  employmentTypeId?: UUID;
  employmentNatureId?: UUID;
  gender: '0' | '1' ;
}

// Response type for employee details
export interface EmployeeDetailsData {
  employee: EmployeeListDto;
  
}