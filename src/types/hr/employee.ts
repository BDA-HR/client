import { type UUID } from 'crypto';
import type { BaseDto } from './BaseDto';
import type { EmpNature, EmpType, Gender, YesNo } from './enum';
export type { UUID }

export interface EmployeeListDto extends BaseDto {
  empFullName: string;
  empFullNameAm: string;
  code: string;
  gender: string;
  branch: string;
  department: string;
  position: string;
  jobGrade: string;
  empType: string;
  empNature: string;
  photo: string;
}

export interface EmployeeModDto {
  id: UUID;
  firstName: string;
  firstNameAm: string;
  middleName: string;
  middleNameAm: string;
  lastName: string;
  lastNameAm: string;
  gender: Gender; // enum.Gender (0/1)
  nationality: string;
  employmentDate: string;
  jobGradeId: UUID;  //Cor.HRMM.JobGrade
  positionId: UUID;  //Cor.HRMM.Position
  departmentId: UUID;  //Cor.Module.Department
  employmentType: EmpType; //enum.EmpType (0/1)
  employmentNature: EmpNature; //enum.EmpNature (0/1)
  rowVersion: string;
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
  gender: Gender; // enum.Gender (0/1)
  relationId: UUID;
  addressId: UUID;
  employeeId: UUID;
}

export interface EmpBioAddDto {
  birthDate: string;
  birthLocation: string;
  motherFullName: string;
  hasBirthCert: YesNo; // enum.YesNo (0/1)
  hasMarriageCert: YesNo; // enum.YesNo (0/1)
  maritalStatus: UUID; // enum.YesNo (0/1)
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
  gender: Gender; // enum.Gender (0/1)
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
  gender: Gender; // enum.Gender (0/1)
  nationality: string;
  addressId: UUID;
  relationId: UUID;
  employeeId: UUID;
}

export interface EmpPensionCardAddDto {
  registrationDate: string;
  sentDate?: string;
  receivedDate?: string;
  isReceived: YesNo; // enum.YesNo (0/1)
  isSent: YesNo; // enum.YesNo (0/1)
  employeeId: UUID;
}

export interface EmpStateAddDto {
  isTerminated: YesNo; // enum.YesNo (0/1)
  isApproved: YesNo; // enum.YesNo (0/1)
  isStandBy: YesNo; // enum.YesNo (0/1)
  isRetired: YesNo; // enum.YesNo (0/1)
  isUnderProbation: YesNo; // enum.YesNo (0/1)
  employeeId: UUID;
}

// Filter types
export interface EmployeeFilters {
  searchTerm: string;
  departmentId?: UUID;
  positionId?: UUID;
  jobGradeId?: UUID;
  employmentTypeId?: UUID; // Update this
  employmentNatureId?: UUID; // Update this
  gender: '0' | '1' | '';
}

export interface EmployeeDetailsData {
  employee: EmployeeListDto;
}