import type { UUID } from 'crypto';

export type { UUID };

export interface RegStep1 {
  employeeId: UUID;
  password: string;
  roleId: string;
  perModules: UUID[];
}

export interface RegStep2 {
  userId: string;
  perMenus: UUID[];
}

export interface RegStep3 {
  userId: string;
  perAccess: UUID[];
}

export interface RegRes {
  userId: string; 
}