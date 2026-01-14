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

// Period Quarter enum
export const Quarter = {
  "0": '1st Quarter',
  "1": '2nd Quarter',
  "2": '3rd Quarter',
  "3": '4th Quarter'
} as const;
export type Quarter = typeof Quarter[keyof typeof Quarter];

export const PeriodStat = {
  "0": 'Active',
  "1": 'Inactive'
} as const;
export type PeriodStat = typeof PeriodStat[keyof typeof PeriodStat];

export const LeaveCategory = {
  "0": 'Paid',
  "1": 'Unpaid',
  "2": 'Special'
} as const;
export type LeaveCategory = typeof LeaveCategory[keyof typeof LeaveCategory];

export const PolicyGender = {
  "0": 'Male',
  "1": 'Female',
  "2": 'Male & Female'
} as const;
export type PolicyGender = typeof PolicyGender[keyof typeof PolicyGender];

export const LeaveCondition = {
  "0": "With Half Salary",
  "1": "With Full Salary",
  "2": "With No Salary",
} as const;
export type LeaveCondition = (typeof LeaveCondition)[keyof typeof LeaveCondition];

export const ApprovalRole = {
  "0": "Manager",
  "1": "HR",
  "2": "Director",
} as const;
export type ApprovalRole = (typeof ApprovalRole)[keyof typeof ApprovalRole];

export const PolicyStatus = {
  "0": "",
  "1": "Inactive",
} as const;
export type PolicyStatus = (typeof PolicyStatus)[keyof typeof PolicyStatus];