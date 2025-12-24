export interface NameList {
  id: string;
  name: string;
}

// Main DTOs
export interface MenuPerApiListDto {
  perMenuId: string; // PerMenu
  perMenu: string; // PerMenu
  perApiList: NameList[];
}

export interface PerApiListDto {
  id: string;
  perMenuId: string; // PerMenu
  key: string;
  name: string;
  perMenu: string; // PerMenu
}

export interface PerApiAddDto {
  perMenuId: string; // PerMenu
  key: string;
  desc: string;
}

export interface PerApiModDto {
  perMenuId: string; // PerMenu
  id: string;
  key: string;
  desc: string;
}