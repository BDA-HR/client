import type { UUID } from "crypto";

export type { UUID };

export interface NameList {
  id: UUID;
  name: string;
}

// Main DTOs
export interface MenuPerApiListDto {
  perMenuId: UUID; // PerMenu
  perMenu: string; // PerMenu
  perApiList: NameList[];
}

export interface PerApiListDto {
  id: UUID;
  perMenuId: UUID;
  key: string;
  name: string;
  perMenu: string;
}

export interface PerApiAddDto {
  perMenuId: UUID; // PerMenu
  key: string;
  desc: string;
}

export interface PerApiModDto {
  perMenuId: UUID; // PerMenu
  id: UUID;
  key: string;
  desc: string;
}