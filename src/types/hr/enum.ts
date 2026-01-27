export const Gender = {
  "0": 'Male',
  "1": 'Female'
} as const;
export type Gender = typeof Gender[keyof typeof Gender];

export const GenderAm = {
  "0": 'ወንድ',
  "1": 'ሴት'
} as const;
export type GenderAm = typeof GenderAm[keyof typeof GenderAm];

export const PositionGender = {
  "0": 'Male',
  "1": 'Female',
  "2": 'Male/Female'
} as const;
export type PositionGender = typeof PositionGender[keyof typeof PositionGender];

export const PositionGenderAm = {
  "0": 'ወንድ',
  "1": 'ሴት',
  "2": 'ሁለቱም'
} as const;
export type PositionGenderAm = typeof PositionGenderAm[keyof typeof PositionGenderAm];

export const YesNo = {
  "0": 'Yes',
  "1": 'No'
} as const;
export type YesNo = typeof YesNo[keyof typeof YesNo];

export const YesNoAm = {
  "0": 'አዎ',
  "1": 'አይ'
} as const;
export type YesNoAm = typeof YesNoAm[keyof typeof YesNoAm];

export const WorkOption = {
  "0": 'Morning',
  "1": 'Afternoon',
  "2": 'Both',
  "3": 'None'
} as const;
export type WorkOption = typeof WorkOption[keyof typeof WorkOption];

export const WorkOptionAm = {
  "0": 'ጠዋት',
  "1": 'ከሰዓት',
  "2": 'ሁለቱም',
  "3": 'ምንም'
} as const;
export type WorkOptionAm = typeof WorkOptionAm[keyof typeof WorkOptionAm];

export const Per = {
  "0": 'Day',
  "1": 'Month',
  "2": 'Year'
} as const;
export type Per = typeof Per[keyof typeof Per];

export const PerAm = {
  "0": 'ቀን',
  "1": 'ወር',
  "2": 'አመት'
} as const;
export type PerAm = typeof PerAm[keyof typeof PerAm];

export const ProfessionType = {
  "0": 'Professional',
  "1": 'Semi-Professional',
  "2": 'Non-Professional'
} as const;
export type ProfessionType = typeof ProfessionType[keyof typeof ProfessionType];

export const EmpType = {
  "0": 'Replacement',
  "1": 'New Opening',
  "2": 'Additional Required',
  "3": 'Old Employee'
} as const;
export type EmpType = typeof EmpType[keyof typeof EmpType];

export const EmpNature = {
  "0": 'Permanent / Full-time',
  "1": 'Contract / Fixed-term',
  "2": 'Probation',
  "3": 'Intern / Trainee',
  "4": 'Part-time / Casual'
} as const;
export type EmpNature = typeof EmpNature[keyof typeof EmpNature];

export const MaritalStat = {
  "0": 'Single / Not Married',
  "1": 'Married',
  "2": 'Widow/er',
  "3": 'Divorced',
  "4": 'Not Mentioned'
} as const;
export type MaritalStat = typeof MaritalStat[keyof typeof MaritalStat];

export const AddressType = {
  "0": 'Residence',
  "1": 'Work Place'
} as const;
export type AddressType = typeof AddressType[keyof typeof AddressType];

export const WorkArrangement = {
  "0": 'On-site',
  "1": 'Remote',
  "2": 'Hybrid',
  "3": 'Shift-based',
  "4": 'Rotational / Roster-based'
} as const;
export type WorkArrangement = typeof WorkArrangement[keyof typeof WorkArrangement];