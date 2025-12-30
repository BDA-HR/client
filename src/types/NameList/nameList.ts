import type { UUID } from '../List/list';

export interface NameListItem {
  id: UUID;
  name: string;
}

export interface RoleListItem {
  id: UUID;
  role: string;
}

// export interface JgStepNameItem {
//   id: UUID;
//   name: string; // JOB GRADE STEP NAME
//   jobGrade: string; // JOB GRADE
// }