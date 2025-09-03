export const YesNoAm = {
  Yes: 'አዎ',
  No: 'አይ'
} as const;
export type YesNoAm = typeof YesNoAm[keyof typeof YesNoAm];

export const YesNo = {
  Yes: 'Yes',
  No: 'No'
} as const;
export type YesNo = typeof YesNo[keyof typeof YesNo];

export const BranchType = {
  HeadOff: 'Head Office',
  RegOff: 'Regional',
  LocOff: 'Local',
  VirOff: 'Virtual'
} as const;
export type BranchType = typeof BranchType[keyof typeof BranchType];

export const BranchStat = {
  Active: 'Active',
  InAct: 'Inactive',
  UndCon: 'Under construction'
} as const;
export type BranchStat = typeof BranchStat[keyof typeof BranchStat];

export const DeptStat = {
  Active: 'Active',
  InAct: 'Inactive'
} as const;
export type DeptStat = typeof DeptStat[keyof typeof DeptStat];