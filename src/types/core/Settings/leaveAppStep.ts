import type { UUID } from "crypto";
import type { BaseDto } from "../../hr/BaseDto";

export type { UUID };

export interface LeaveAppStepListDto extends BaseDto {
  stepName: string;
  stepOrder: number;
  role: string;
  isFinal: boolean;
  roleStr: string;
  isFinalStr: string;
  employee: string | null;
  leaveAppChain: string;
}

// Add DTO
export interface LeaveAppStepAddDto {
  stepName: string;
  stepOrder: number;
  role: string; 
  employeeId: string | null; 
  isFinal: boolean;
  leaveAppChainId: UUID; 
}

// Modify/Update DTO
export interface LeaveAppStepModDto {
  id: UUID;
  stepName: string;
  stepOrder: number;
  role: string; 
  employeeId:UUID | null; 
  isFinal: boolean;
  leaveAppChainId: UUID; 
  rowVersion: string;
}