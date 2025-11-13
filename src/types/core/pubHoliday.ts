import type { UUID } from 'crypto';

export type { UUID };

export interface AddPubHolidayDto {
  name: string;
  nameAm: string;
  date: string; 
}

export interface PubHolidayDto {
  id: UUID;
  name: string;
  nameAm: string;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  fiscalYearId?: UUID;
}

export interface PubHolidayListDto {
  id: UUID;
  name: string;
  nameAm: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  fiscalYearId: UUID;
  fiscalYearName?: string;
}

export interface EditPubHolidayDto {
  id: UUID;
  name?: string;
  nameAm?: string;
  date?: string;
  description?: string;
  rowVersion?: string;
}