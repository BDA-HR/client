import type { BaseDto } from './BaseDto';

export type UUID = string;

export interface FiscYearListDto extends BaseDto {
  name: string;
  isActive: string;
  dateStart: string; 
  dateEnd: string;  
  startDate: string;
  startDateAm: string;
  endDate: string;
  endDateAm: string;
}

export interface AddFiscYearDto {
  name: string;
  dateStart: string; 
  dateEnd: string;
  isActive: string;
}

export interface EditFiscYearDto {
  id: UUID;
  name: string;
  dateStart: string;
  dateEnd: string;
  isActive: string;
  rowVersion: string;
}