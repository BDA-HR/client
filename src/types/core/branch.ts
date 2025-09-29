import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };

export interface BranchListDto extends BaseDto {
  name: string;
  nameAm: string;
  code: string;
  location: string;
  branchType: string;
  branchStat: string;
  comp: string;
  compAm: string;
  dateOpenedAm: string;
  dateOpened: string;
}

export interface AddBranchDto {
  name: string;
  nameAm: string;
  code: string;
  location: string;
  dateOpened: string; // ISO string format for DateTime
  branchType: string;
  compId: UUID;
}

export interface EditBranchDto {
  id: UUID;
  name: string;
  nameAm: string;
  code: string;
  location: string;
  dateOpened: string; // ISO string format
  branchType: string;
  branchStat: string;
  compId: UUID;
  rowVersion: string;
}

// Original Branch interface for detailed view
export interface Branch extends BaseDto {
  branchId: string;
  name: string;
  nameAm: string;
  code: string;
  location: string;
  branchType: string;
  branchStat: string;
  compId: UUID;
  comp: string;
  compAm: string;
  openDate: string; // ISO string format
  dateOpenedAm: string;
  dateOpened: string;
}