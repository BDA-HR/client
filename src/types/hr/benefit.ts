import type { UUID } from 'crypto';
import type { BaseDto } from './BaseDto';

export interface BenefitSetListDto extends BaseDto {
  name: string;
  benefit: number;
  benefitStr: string;
}

export interface BenefitSetAddDto {
  name: string;
  benefitValue: number;
}

export interface BenefitSetModDto {
  id: UUID;
  name: string;
  benefitValue: number;
  rowVersion: string;
}