import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export type { UUID };

// Position Experience Types
export interface PositionExpListDto extends BaseDto {
  positionId: UUID;
  samePosExp: number;
  otherPosExp: number;
  minAge: number;
  maxAge: number;
  position: string;
  positionAm: string;
}

export interface PositionExpAddDto {
  samePosExp: number;
  otherPosExp: number;
  minAge: number;
  maxAge: number;
  positionId: UUID;
}

export interface PositionExpModDto {
  id: UUID;
  samePosExp: number;
  otherPosExp: number;
  minAge: number;
  maxAge: number;
  positionId: UUID;
  rowVersion: string;
}

// Position Benefit Types
export interface PositionBenefitListDto extends BaseDto {
  benefitSettingId: UUID;
  positionId: UUID;
  position: string;
  positionAm: string;
}

export interface PositionBenefitAddDto {
  benefitSettingId: UUID;
  positionId: UUID;
}

export interface PositionBenefitModDto {
  id: UUID;
  benefitSettingId: UUID;
  positionId: UUID;
  rowVersion: string;
}

// Position Education Types
export interface PositionEduListDto extends BaseDto {
  positionId: UUID;
  educationQualId: UUID;
  educationLevelId: UUID;
  position: string;
  positionAm: string;
  educationQual: string;
  educationLevel: string;
}

export interface PositionEduAddDto {
  positionId: UUID;
  educationQualId: UUID;
  educationLevelId: UUID;
}

export interface PositionEduModDto {
  id: UUID;
  positionId: UUID;
  educationQualId: UUID;
  educationLevelId: UUID;
  rowVersion: string;
}

// Position Requirement Types
export interface PositionReqListDto extends BaseDto {
  professionTypeId: UUID;
  positionId: UUID;
  gender: string; // enum.PositionGender (0/1)
  saturdayWorkOption: string; // enum.WorkOption (0/1)
  sundayWorkOption: string; // enum.WorkOption (0/1)
  workingHours: number;
  genderStr: string;
  saturdayWorkOptionStr: string;
  sundayWorkOptionStr: string;
  professionType: string;
  position: string;
  positionAm: string;
}

export interface PositionReqAddDto {
  gender: string; // enum.PositionGender (0/1)
  saturdayWorkOption: string; // enum.WorkOption (0/1)
  sundayWorkOption: string; // enum.WorkOption (0/1)
  workingHours: number;
  professionTypeId: UUID;
  positionId: UUID;
}

export interface PositionReqModDto {
  id: UUID;
  gender: string; // enum.PositionGender (0/1)
  saturdayWorkOption: string; // enum.WorkOption (0/1)
  sundayWorkOption: string; // enum.WorkOption (0/1)
  workingHours: number;
  professionTypeId: UUID;
  positionId: UUID;
  rowVersion: string;
}


// Optional: Combined types for forms or specific use cases
export type PositionSettingType = 
  | 'experience' 
  | 'benefit' 
  | 'education' 
  | 'requirement';

export interface PositionSettingTab {
  id: PositionSettingType;
  label: string;
  description: string;
}