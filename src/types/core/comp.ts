import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };

export interface CompListDto extends BaseDto {
  name: string;
  nameAm: string;
  branchCount: string;
}

export interface AddCompDto {
  name: string;
  nameAm: string;
}

export interface EditCompDto {
  id: UUID;
  name: string;
  nameAm: string;
  rowVersion: string;
}