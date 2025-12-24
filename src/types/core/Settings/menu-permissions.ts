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
  id: string;
  perModuleId: string; // PerModule
  key: string;
  name: string;
  module: string; // PerModule
}

export interface PerMenuAddDto {
  perModuleId: string; // PerModule
  key: string;
  desc: string;
}

export interface PerMenuModDto {
  perModuleId: string; // PerModule
  id: string;
  key: string;
  desc: string;
}