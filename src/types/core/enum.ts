export const YesNoAm = {
  "0": 'አዎ',
  "1": 'አይ'
} as const;
export type YesNoAm = typeof YesNoAm[keyof typeof YesNoAm];

export const YesNo = {
  "0": 'Yes',
  "1": 'No'
} as const;
export type YesNo = typeof YesNo[keyof typeof YesNo];

export const BranchType = {
  "0": 'Head Office',
  "1": 'Regional',
  "2": 'Local',
  "3": 'Virtual'
} as const;
export type BranchType = typeof BranchType[keyof typeof BranchType];

export const BranchStat = {
  "0": 'Active',
  "1": 'Inactive',
  "2": 'Under construction'
} as const;
export type BranchStat = typeof BranchStat[keyof typeof BranchStat];

export const DeptStat = {
  "0": 'Active',
  "1": 'Inactive'
} as const;
export type DeptStat = typeof DeptStat[keyof typeof DeptStat];

// Remove FiscStat since we're using YesNo for fiscal year status
// export const FiscStat = {
//   "0": 'Active',
//   "1": 'Inactive'
// } as const;
// export type FiscStat = typeof FiscStat[keyof typeof FiscStat];

export const PeriodStat = {
  "0": 'Active',
  "1": 'Inactive'
} as const;
export type PeriodStat = typeof PeriodStat[keyof typeof PeriodStat];