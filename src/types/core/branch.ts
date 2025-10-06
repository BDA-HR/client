import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';
import type { BranchType, BranchStat } from './enum';

export type { UUID };

export interface BranchListDto extends BaseDto {
  name: string;
  nameAm: string;
  code: string;
  location: string;
  branchType: BranchType;
  branchStat: BranchStat;
  comp: string;
  compAm: string;
  openDate: string;
  branchTypeStr: string;
  branchStatStr: string;
  openDateStr: string;
  openDateStrAm: string;
}

export interface BranchCompListDto {
  id: UUID;
  name: string;
  nameAm: string;
}

export interface AddBranchDto {
  name: string;
  nameAm: string;
  code: string;
  location: string;
  dateOpened: string;
  branchType: BranchType;
  compId: UUID;
}

export interface EditBranchDto {
  id: UUID;
  name: string;
  nameAm: string;
  code: string;
  location: string;
  dateOpened: string;
  branchType: BranchType;
  branchStat: BranchStat;
  compId: UUID;
  rowVersion: string;
}

// Original Branch interface for detailed view (if still needed)
export interface Branch extends BaseDto {
  branchId: string;
  name: string;
  nameAm: string;
  code: string;
  location: string;
  branchType: BranchType;
  branchStat: BranchStat;
  compId: UUID;
  comp: string;
  compAm: string;
  openDate: string; 
  dateOpenedAm: string;
  dateOpened: string;
}