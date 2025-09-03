import type { BaseDto } from './BaseDto';
import { BranchStat } from './enum';

export interface Branch extends BaseDto {
  branchId: string;
  name: string;
  status: BranchStat;
  city: string;
  country: string;
}

export type { UUID } from './BaseDto';