import type { BaseDto } from './BaseDto';

export type UUID = string;

export interface Company extends BaseDto {
  name: string;
  nameAm: string;
  branchCount: number; 
}

export interface CreateCompanyDto {
  name: string;
  nameAm: string;
}

export interface UpdateCompanyDto {
  id: UUID;
  name: string;
  nameAm: string;
  rowVersion: string;
}