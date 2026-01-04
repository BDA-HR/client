import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };
export interface LeaveRequestListDto extends BaseDto {
  employeeId: UUID; //HRM.Profile.Employee
  approvedById?: UUID; //HRM.Profile.Employee
  leaveTypeId: UUID; // LeaveType
  startDate: string | Date; // Assuming this is DateTime from backend
  endDate: string | Date; // Assuming this is DateTime from backend
  dateRequested: string | Date; // Assuming this is DateTime from backend
  dateApproved?: string | Date; // Assuming this is DateTime from backend
  comments: string;
  daysRequestedStr: string;
  isHalfDayStr: string;
  statusStr: string;
  startDateStr: string; // Format: "MMMM dd, yyyy"
  startDateStrAm: string; // Ethiopian calendar format
  endDateStr: string; // Format: "MMMM dd, yyyy"
  endDateStrAm: string; // Ethiopian calendar format
  dateApprovedStr: string; // Format: "MMMM dd, yyyy" or empty if not approved
  dateApprovedStrAm: string; // Ethiopian calendar format or empty if not approved
  dateRequestedStr: string; // Format: "MMMM dd, yyyy"
  dateRequestedStrAm: string; // Ethiopian calendar format
  approvedBy: string;
  employee: string;
  leaveType: string;
}

export interface LeaveTypeDto {
  id: UUID;
  name: string;
}
export interface LeaveRequestAddDto {
  leaveTypeId: UUID;
  startDate: string | Date; // Assuming this is DateTime
  endDate: string | Date; // Assuming this is DateTime
  isHalfDay: boolean;
  comments: string;
}

export interface LeaveRequestModDto {
  id: UUID;
  leaveTypeId: UUID;
  startDate: string | Date; 
  endDate: string | Date; 
  isHalfDay: boolean;
  comments: string;
  rowVersion: string;
}