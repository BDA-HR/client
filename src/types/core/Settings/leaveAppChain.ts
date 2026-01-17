import type { UUID } from "crypto";
import type { BaseDto } from "../../hr/BaseDto";

export type { UUID };

export interface LeaveAppChainListDto extends BaseDto {
  effectiveFrom: Date; 
  effectiveTo: Date | null; 
  isActive: boolean;
  effectiveFromStr: string;
  effectiveToStr: string;
  isActiveStr: string;
  leavePolicy: string;
}

export interface LeaveAppChainAddDto {
  leavePolicyId: UUID;
  effectiveFrom: Date; 
  effectiveTo?: Date | null;
  isActive: boolean;
}

export interface LeaveAppChainModDto {
  id: UUID;
  leavePolicyId: UUID;
  effectiveFrom: Date; 
  effectiveTo?: Date | null; 
  isActive: boolean;
  rowVersion: string;
}
