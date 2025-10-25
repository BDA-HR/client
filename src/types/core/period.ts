import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';
import type { Quarter } from './enum';

export type { UUID };

export interface PeriodListDto extends BaseDto {
  quarterId: Quarter;
  fiscalYearId: UUID;
  name: string;
  quarter: string;
  fiscYear: string;
  isActive: string;
  isActiveStr: string;
  dateStart: string; // DateTime in C# becomes string in TypeScript
  dateEnd: string; // DateTime in C# becomes string in TypeScript
  dateStartStr: string;
  dateStartStrAm: string;
  dateEndStr: string;
  dateEndStrAm: string;
}

export interface AddPeriodDto {
  name: string;
  dateStart: string;
  dateEnd: string;
  isActive: string;
  quarterId: Quarter;
  fiscalYearId: UUID;
}

export interface EditPeriodDto {
  id: UUID;
  name: string;
  dateStart: string;
  dateEnd: string;
  isActive: string;
  quarterId: Quarter;
  fiscalYearId: UUID;
  rowVersion: string;
}