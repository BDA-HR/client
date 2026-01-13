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
  label?: string; // New label field (optional for backward compatibility)
  path?: string; // New path field (optional for backward compatibility)
  icon?: string; // New icon field (optional for backward compatibility)
  isChild?: boolean; // New isChild field (optional for backward compatibility)
  parentKey?: string; // New parentKey field (optional for backward compatibility)
  order?: number; // New order field (optional for backward compatibility)
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