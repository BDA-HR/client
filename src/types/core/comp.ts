import type { BaseDto } from './BaseDto';

export type UUID = string;

export interface CompListDto extends BaseDto {
  name: string;
  nameAm: string;
  branchCount: number;
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