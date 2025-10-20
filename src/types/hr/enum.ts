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
  "2": 'Both'
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