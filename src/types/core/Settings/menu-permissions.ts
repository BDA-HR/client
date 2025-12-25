import type { UUID } from "crypto";

export type { UUID };

export interface NameList {
  id: string;
  name: string;
}

// Main DTOs
export interface ModPerMenuListDto {
  perModuleId: string; // PerModule
  perModule: string; // PerModule
  perMenuList: NameList[];
}

export interface PerMenuListDto {
  id: UUID;
  perModuleId: UUID; // PerModule
  key: string;
  name: string;
  module: string; // PerModule
}

export interface PerMenuAddDto {
  perModuleId: UUID; // PerModule
  key: string;
  desc: string;
}

export interface PerMenuModDto {
  perModuleId: UUID; // PerModule
  id: UUID;
  key: string;
  desc: string;
}