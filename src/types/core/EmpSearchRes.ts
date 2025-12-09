import type { UUID } from 'crypto';

export type {UUID} 
export interface EmpSearchRes {
  id: UUID;
  photo: string;
  code: string;
  fullName: string;
  fullNameAm: string;
  gender: string;
  dept: string;
  position: string;
}