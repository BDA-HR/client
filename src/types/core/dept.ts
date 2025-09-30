import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };


export interface DeptListDto extends BaseDto {
  branchId: UUID;
  name: string;
  nameAm: string;
  deptStat: string;
  branch: string;
  branchAm: string;
}

export interface AddDeptDto {
  name: string;
  nameAm: string;
  branchId: UUID;
}

export interface EditDeptDto {
  id: UUID;
  name: string;
  nameAm: string;
  deptStat: string;
  branchId: UUID;
  rowVersion: string;
}