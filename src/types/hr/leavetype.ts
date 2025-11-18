import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };

// Leave Type Types
export interface LeaveTypeListDto extends BaseDto {
  name: string;
  code: string; // enum.LeaveTypeCode (0/1)
  isPaid: boolean;
  codeStr: string;
  isPaidStr: string;
}

export interface LeaveTypeAddDto {
  name: string;
  code: string; // enum.LeaveTypeCode (0/1)
  isPaid: boolean;
}

export interface LeaveTypeModDto {
  id: UUID;
  name: string;
  code: string; // enum.LeaveTypeCode (0/1)
  isPaid: boolean;
  rowVersion: string;
}

// Service response types (if needed for dropdowns/selects)
export interface LeaveTypeCodeDto {
  id: string; // '0' or '1'
  name: string;
  nameAm?: string;
}

export interface PaidStatusDto {
  id: boolean;
  name: string;
  nameAm?: string;
}

// Combined types for UI
export type LeaveTypeFilterType = 
  | 'all' 
  | 'paid' 
  | 'unpaid' 
  | 'byCode';

export interface LeaveTypeFilters {
  searchTerm: string;
  isPaid?: boolean;
  code?: string;
}

export interface LeaveTypeTableData {
  data: LeaveTypeListDto[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

// Form data types
export interface LeaveTypeFormData {
  name: string;
  code: string;
  isPaid: boolean;
}

// Validation types
export interface LeaveTypeValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    code?: string;
    isPaid?: string;
  };
}