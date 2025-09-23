// types/core/period.ts
import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };

export interface PeriodListDto extends BaseDto {
  name: string;
  quarter: string;
  fiscYear: string;
  isActive: string;
  dateStart: string; 
  dateEnd: string; 
  startDate: string;
  startDateAm: string;
  endDate: string;
  endDateAm: string;
}

export interface AddPeriodDto {
  name: string;
  dateStart: string;
  dateEnd: string; 
  isActive: string;
  quarterId: UUID;
  fiscalYearId: UUID;
}

export interface EditPeriodDto {
  id: UUID;
  name: string;
  dateStart: string;
  dateEnd: string;
  isActive: string;
  quarterId: UUID;
  fiscalYearId: UUID;
  rowVersion: string;
}