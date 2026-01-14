import type { UUID } from "crypto";
import type { BaseDto } from "../BaseDto";

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

export interface PerMenuListDto extends BaseDto {
  perModuleId: UUID; // PerModule
  order: number;
  isChild: boolean;
  key: string;
  label: string;
  isChildStr: string;
  parent: string;
  module: string; // PerModule
  path: string; // PerModule
  icon: string; // PerModule
  parentKey: string; // PerModule
}

export interface PerMenuAddDto {
  perModuleId: UUID;
  key: string;
  label: string;
  path: string;
  icon: string;
  isChild: boolean;
  parentKey: string;
  order: number;
}

export interface PerMenuModDto {
  perModuleId: UUID;
  id: UUID;
  key: string;
  label: string;
  path: string;
  icon: string;
  isChild: boolean;
  parentKey: string;
  order: number;
}