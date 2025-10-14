// types/hr/jobgrade/JgStep.ts
import type { UUID } from 'crypto';
import type { BaseDto } from '../core/BaseDto';

export type { UUID };
export interface JgStepListDto extends BaseDto {
  jobGradeId: UUID;
  name: string;
  salary: number;
  jobGrade: string; // Job grade name for display
}

export interface JgStepAddDto {
  name: string;
  salary: number;
  jobGradeId: UUID;
}

export interface JgStepModDto {
  id: UUID;
  name: string;
  salary: number;
  jobGradeId: UUID;
  rowVersion: string;
}