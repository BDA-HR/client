import type { UUID } from 'crypto';

export type { UUID };

export interface AddHolidayDto {
  name: string;
  date: string; // ISO date string
  isPublic: boolean;
  fiscalYearId: UUID; // Added this required field
}

export interface HolidayDto {
  id: UUID;
  name: string;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  fiscalYearId?: UUID;
  isPublic: boolean;
}

export interface HolidayListDto {
  id: UUID;
  name: string;
  date: string;
  dateStr: string; // Format: "MMMM dd, yyyy" (e.g., "January 15, 2024")
  dateStrAm: string; // Ethiopian calendar format: "MMMM dd, yyyy"
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  fiscalYearId: UUID;
  fiscalYearName?: string;
  isPublic: boolean;
  isPublicStr: string;
  fiscYear: string;
}

export interface EditHolidayDto {
  id: UUID;
  name: string;
  date: string; // ISO date string
  isPublic: boolean;
  rowVersion: string;
  
}