import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };

// Leave Type Types
export interface LeaveTypeListDto extends BaseDto {
  name: string;
  isPaid: boolean;
  isPaidStr: string;
}

export interface LeaveTypeAddDto {
  name: string;
  isPaid: boolean;
}

export interface LeaveTypeModDto {
  id: UUID;
  name: string;
  isPaid: boolean;
  rowVersion: string;
}

// Service response types (if needed for dropdowns/selects)
export interface PaidStatusDto {
  id: boolean;
  name: string;
  nameAm?: string;
}

// Combined types for UI
export type LeaveTypeFilterType = 
  | 'all' 
  | 'paid' 
  | 'unpaid';

export interface LeaveTypeFilters {
  searchTerm: string;
  isPaid?: boolean;
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
  isPaid: boolean;
}

// Validation types
export interface LeaveTypeValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    isPaid?: string;
  };
}

// Card display props
export interface LeaveTypeCardProps {
  leaveType: LeaveTypeListDto;
  viewMode: 'grid' | 'list';
  onEdit: (leaveType: LeaveTypeListDto) => void;
  onDelete: (leaveType: LeaveTypeListDto) => void;
}

// Modal props
export interface LeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (leaveType: LeaveTypeModDto) => void;
  onAddLeaveType?: (leaveType: LeaveTypeAddDto) => void;
  leaveType?: LeaveTypeListDto | null;
}

// Search and filter props
export interface LeaveSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  leaveTypeData: LeaveTypeListDto[];
  onAddClick: () => void;
}