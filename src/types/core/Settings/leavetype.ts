import type { UUID } from 'crypto';
import type { BaseDto } from '../../hr/BaseDto';
import type { LeaveCategory } from '../enum';

export type { UUID };

// Leave Type Types
export interface LeaveTypeListDto extends BaseDto {
  name: string;
  requiresApproval: boolean;
  allowHalfDay: boolean;
  holidaysAsLeave: boolean;
  isActive: boolean;
  leaveCategory: string;
  leaveCategoryStr: string;
  requiresApprovalStr: string;
  allowHalfDayStr: string;
  isActiveStr: string;
  holidaysAsLeaveStr: string;
}

export interface LeaveTypeAddDto {
  name: string;
  leaveCategory: LeaveCategory;
  requiresApproval: boolean;
  allowHalfDay: boolean;
  holidaysAsLeave: boolean;
}

export interface LeaveTypeModDto {
  id: UUID;
  name: string;
  leaveCategory: LeaveCategory;
  requiresApproval: boolean;
  allowHalfDay: boolean;
  holidaysAsLeave: boolean;
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