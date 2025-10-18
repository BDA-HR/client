import type { 
  PositionListDto, 
  PositionAddDto, 
  PositionModDto,
  PositionExpListDto,
  PositionExpAddDto,
  PositionExpModDto,
  PositionBenefitListDto,
  PositionBenefitAddDto,
  PositionBenefitModDto,
  PositionEduListDto,
  PositionEduAddDto,
  PositionEduModDto,
  PositionReqListDto,
  PositionReqAddDto,
  PositionReqModDto,
  EducationLevelDto,
  ProfessionTypeDto,
  BenefitSettingDto,
  UUID 
} from '../../types/hr/position';

// Dummy data
const dummyPositions: PositionListDto[] = [
  {
    id: '1' as UUID,
    departmentId: 'dept-1' as UUID,
    isVacant: '1',
    name: 'Software Engineer',
    nameAm: 'ሶፍትዌር ኢንጂነር',
    noOfPosition: 5,
    isVacantStr: 'Vacant',
    department: 'IT Department',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: '1'
  },
  {
    id: '2' as UUID,
    departmentId: 'dept-2' as UUID,
    isVacant: '0',
    name: 'HR Manager',
    nameAm: 'ሰው ሀብት አስተዳዳሪ',
    noOfPosition: 1,
    isVacantStr: 'Filled',
    department: 'Human Resources',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: '1'
  },
  {
    id: '3' as UUID,
    departmentId: 'dept-3' as UUID,
    isVacant: '1',
    name: 'Sales Executive',
    nameAm: 'የሽያጭ ፈጻሚ',
    noOfPosition: 3,
    isVacantStr: 'Vacant',
    department: 'Sales Department',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: '1'
  }
];

const dummyPositionExp: PositionExpListDto[] = [
  {
    id: 'exp-1' as UUID,
    positionId: '1' as UUID,
    samePosExp: 3,
    otherPosExp: 2,
    minAge: 25,
    maxAge: 40,
    position: 'Software Engineer',
    positionAm: 'ሶፍትዌር ኢንጂነር',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: '1'
  }
];

const dummyPositionBenefits: PositionBenefitListDto[] = [
  {
    id: 'benefit-1' as UUID,
    benefitSettingId: 'benefit-setting-1' as UUID,
    positionId: '1' as UUID,
    position: 'Software Engineer',
    positionAm: 'ሶፍትዌር ኢንጂነር',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: '1'
  }
];

const dummyPositionEducation: PositionEduListDto[] = [
  {
    id: 'edu-1' as UUID,
    positionId: '1' as UUID,
    educationQualId: 'edu-qual-1' as UUID,
    educationLevelId: 'edu-level-1' as UUID,
    position: 'Software Engineer',
    positionAm: 'ሶፍትዌር ኢንጂነር',
    educationQual: 'Computer Science',
    educationLevel: "Bachelor's Degree",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: '1'
  }
];

const dummyPositionRequirements: PositionReqListDto[] = [
  {
    id: 'req-1' as UUID,
    positionId: '1' as UUID,
    professionTypeId: 'prof-type-1' as UUID,
    gender: '2',
    saturdayWorkOption: '0',
    sundayWorkOption: '1',
    workingHours: 8,
    genderStr: 'Both',
    saturdayWorkOptionStr: 'Morning',
    sundayWorkOptionStr: 'Afternoon',
    professionType: 'Technical',
    position: 'Software Engineer',
    positionAm: 'ሶፍትዌር ኢንጂነር',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rowVersion: '1'
  }
];

// Update the dummyEducationLevels array
const dummyEducationLevels: EducationLevelDto[] = [
  { id: 'edu-level-1' as UUID, name: 'Preparatory', nameAm: 'ዝግጅት' },
  { id: 'edu-level-2' as UUID, name: 'College', nameAm: 'ኮሌጅ' },
  { id: 'edu-level-3' as UUID, name: 'TVT', nameAm: 'ቴክኒክ እና ሙያ ትምህርት' },
  { id: 'edu-level-4' as UUID, name: 'High School', nameAm: 'ሁለተኛ ደረጃ ትምህርት' },
  { id: 'edu-level-5' as UUID, name: 'University', nameAm: 'ዩኒቨርሲቲ' },
  { id: 'edu-level-6' as UUID, name: 'Elementary', nameAm: 'መሠረት ትምህርት' }
];

const dummyProfessionTypes: ProfessionTypeDto[] = [
  { id: 'prof-type-1' as UUID, name: 'Technical', nameAm: 'ቴክኒካል' },
  { id: 'prof-type-2' as UUID, name: 'Administrative', nameAm: 'አስተዳደር' },
  { id: 'prof-type-3' as UUID, name: 'Sales', nameAm: 'ሽያጭ' },
  { id: 'prof-type-4' as UUID, name: 'Management', nameAm: 'አስተዳደር' }
];

const dummyBenefitSettings: BenefitSettingDto[] = [
  { id: 'benefit-setting-1' as UUID, name: 'Health Insurance', nameAm: 'ጤና ኢንሹራንስ' },
  { id: 'benefit-setting-2' as UUID, name: 'Transport Allowance', nameAm: 'የትራንስፖርት እርዳታ' },
  { id: 'benefit-setting-3' as UUID, name: 'Housing Allowance', nameAm: 'የመኖሪያ እርዳታ' },
  { id: 'benefit-setting-4' as UUID, name: 'Pension Plan', nameAm: 'ጡረታ እቅድ' }
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Position Services with dummy data
export const positionService = {
  // Position CRUD
  getAllPositions: async (): Promise<PositionListDto[]> => {
    await delay(500);
    return [...dummyPositions];
  },
  
  getPosition: async (id: UUID): Promise<PositionListDto> => {
    await delay(300);
    const position = dummyPositions.find(p => p.id === id);
    if (!position) throw new Error('Position not found');
    return { ...position };
  },
  
  addPosition: async (data: PositionAddDto): Promise<void> => {
    await delay(400);
    const newPosition: PositionListDto = {
      id: `position-${Date.now()}` as UUID,
      departmentId: data.departmentId,
      isVacant: data.isVacant,
      name: data.name,
      nameAm: data.nameAm,
      noOfPosition: data.noOfPosition,
      isVacantStr: data.isVacant === '1' ? 'Vacant' : 'Filled',
      department: 'New Department', // This would come from department service
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    };
    dummyPositions.push(newPosition);
  },
  
  updatePosition: async (id: UUID, data: PositionModDto): Promise<void> => {
    await delay(400);
    const index = dummyPositions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Position not found');
    
    dummyPositions[index] = {
      ...dummyPositions[index],
      name: data.name,
      nameAm: data.nameAm,
      noOfPosition: data.noOfPosition,
      isVacant: data.isVacant,
      isVacantStr: data.isVacant === '1' ? 'Vacant' : 'Filled',
      departmentId: data.departmentId,
      updatedAt: new Date().toISOString(),
      rowVersion: data.rowVersion
    };
  },
  
  deletePosition: async (id: UUID): Promise<void> => {
    await delay(300);
    const index = dummyPositions.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Position not found');
    dummyPositions.splice(index, 1);
  },

  // Position Experience CRUD
  getAllPositionExp: async (): Promise<PositionExpListDto[]> => {
    await delay(500);
    return [...dummyPositionExp];
  },
  
  getPositionExp: async (id: UUID): Promise<PositionExpListDto> => {
    await delay(300);
    const exp = dummyPositionExp.find(e => e.id === id);
    if (!exp) throw new Error('Experience not found');
    return { ...exp };
  },
  
  addPositionExp: async (data: PositionExpAddDto): Promise<void> => {
    await delay(400);
    const position = dummyPositions.find(p => p.id === data.positionId);
    const newExp: PositionExpListDto = {
      id: `exp-${Date.now()}` as UUID,
      positionId: data.positionId,
      samePosExp: data.samePosExp,
      otherPosExp: data.otherPosExp,
      minAge: data.minAge,
      maxAge: data.maxAge,
      position: position?.name || 'Unknown',
      positionAm: position?.nameAm || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    };
    dummyPositionExp.push(newExp);
  },
  
  updatePositionExp: async (id: UUID, data: PositionExpModDto): Promise<void> => {
    await delay(400);
    const index = dummyPositionExp.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Experience not found');
    
    dummyPositionExp[index] = {
      ...dummyPositionExp[index],
      samePosExp: data.samePosExp,
      otherPosExp: data.otherPosExp,
      minAge: data.minAge,
      maxAge: data.maxAge,
      updatedAt: new Date().toISOString(),
      rowVersion: data.rowVersion
    };
  },
  
  deletePositionExp: async (id: UUID): Promise<void> => {
    await delay(300);
    const index = dummyPositionExp.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Experience not found');
    dummyPositionExp.splice(index, 1);
  },

  // Position Benefit CRUD
  getAllPositionBenefit: async (): Promise<PositionBenefitListDto[]> => {
    await delay(500);
    return [...dummyPositionBenefits];
  },
  
  getPositionBenefit: async (id: UUID): Promise<PositionBenefitListDto> => {
    await delay(300);
    const benefit = dummyPositionBenefits.find(b => b.id === id);
    if (!benefit) throw new Error('Benefit not found');
    return { ...benefit };
  },
  
  addPositionBenefit: async (data: PositionBenefitAddDto): Promise<void> => {
    await delay(400);
    const position = dummyPositions.find(p => p.id === data.positionId);
    const newBenefit: PositionBenefitListDto = {
      id: `benefit-${Date.now()}` as UUID,
      benefitSettingId: data.benefitSettingId,
      positionId: data.positionId,
      position: position?.name || 'Unknown',
      positionAm: position?.nameAm || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    };
    dummyPositionBenefits.push(newBenefit);
  },
  
  updatePositionBenefit: async (id: UUID, data: PositionBenefitModDto): Promise<void> => {
    await delay(400);
    const index = dummyPositionBenefits.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Benefit not found');
    
    dummyPositionBenefits[index] = {
      ...dummyPositionBenefits[index],
      benefitSettingId: data.benefitSettingId,
      updatedAt: new Date().toISOString(),
      rowVersion: data.rowVersion
    };
  },
  
  deletePositionBenefit: async (id: UUID): Promise<void> => {
    await delay(300);
    const index = dummyPositionBenefits.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Benefit not found');
    dummyPositionBenefits.splice(index, 1);
  },

  // Position Education CRUD
  getAllPositionEdu: async (): Promise<PositionEduListDto[]> => {
    await delay(500);
    return [...dummyPositionEducation];
  },
  
  getPositionEdu: async (id: UUID): Promise<PositionEduListDto> => {
    await delay(300);
    const edu = dummyPositionEducation.find(e => e.id === id);
    if (!edu) throw new Error('Education not found');
    return { ...edu };
  },
  
  addPositionEdu: async (data: PositionEduAddDto): Promise<void> => {
    await delay(400);
    const position = dummyPositions.find(p => p.id === data.positionId);
    const educationLevel = dummyEducationLevels.find(el => el.id === data.educationLevelId);
    const newEdu: PositionEduListDto = {
      id: `edu-${Date.now()}` as UUID,
      positionId: data.positionId,
      educationQualId: data.educationQualId,
      educationLevelId: data.educationLevelId,
      position: position?.name || 'Unknown',
      positionAm: position?.nameAm || 'Unknown',
      educationQual: 'Computer Science',
      educationLevel: educationLevel?.name || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    };
    dummyPositionEducation.push(newEdu);
  },
  
  updatePositionEdu: async (id: UUID, data: PositionEduModDto): Promise<void> => {
    await delay(400);
    const index = dummyPositionEducation.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Education not found');
    
    dummyPositionEducation[index] = {
      ...dummyPositionEducation[index],
      educationQualId: data.educationQualId,
      educationLevelId: data.educationLevelId,
      updatedAt: new Date().toISOString(),
      rowVersion: data.rowVersion
    };
  },
  
  deletePositionEdu: async (id: UUID): Promise<void> => {
    await delay(300);
    const index = dummyPositionEducation.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Education not found');
    dummyPositionEducation.splice(index, 1);
  },

  // Position Requirement CRUD
  getAllPositionReq: async (): Promise<PositionReqListDto[]> => {
    await delay(500);
    return [...dummyPositionRequirements];
  },
  
  getPositionReq: async (id: UUID): Promise<PositionReqListDto> => {
    await delay(300);
    const req = dummyPositionRequirements.find(r => r.id === id);
    if (!req) throw new Error('Requirement not found');
    return { ...req };
  },
  
  addPositionReq: async (data: PositionReqAddDto): Promise<void> => {
    await delay(400);
    const position = dummyPositions.find(p => p.id === data.positionId);
    const professionType = dummyProfessionTypes.find(pt => pt.id === data.professionTypeId);
    const newReq: PositionReqListDto = {
      id: `req-${Date.now()}` as UUID,
      positionId: data.positionId,
      professionTypeId: data.professionTypeId,
      gender: data.gender,
      saturdayWorkOption: data.saturdayWorkOption,
      sundayWorkOption: data.sundayWorkOption,
      workingHours: data.workingHours,
      genderStr: data.gender === '0' ? 'Male' : data.gender === '1' ? 'Female' : 'Both',
      saturdayWorkOptionStr: data.saturdayWorkOption === '0' ? 'Morning' : data.saturdayWorkOption === '1' ? 'Afternoon' : 'Both',
      sundayWorkOptionStr: data.sundayWorkOption === '0' ? 'Morning' : data.sundayWorkOption === '1' ? 'Afternoon' : 'Both',
      professionType: professionType?.name || 'Unknown',
      position: position?.name || 'Unknown',
      positionAm: position?.nameAm || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rowVersion: '1'
    };
    dummyPositionRequirements.push(newReq);
  },
  
  updatePositionReq: async (id: UUID, data: PositionReqModDto): Promise<void> => {
    await delay(400);
    const index = dummyPositionRequirements.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Requirement not found');
    
    dummyPositionRequirements[index] = {
      ...dummyPositionRequirements[index],
      professionTypeId: data.professionTypeId,
      gender: data.gender,
      saturdayWorkOption: data.saturdayWorkOption,
      sundayWorkOption: data.sundayWorkOption,
      workingHours: data.workingHours,
      genderStr: data.gender === '0' ? 'Male' : data.gender === '1' ? 'Female' : 'Both',
      saturdayWorkOptionStr: data.saturdayWorkOption === '0' ? 'Morning' : data.saturdayWorkOption === '1' ? 'Afternoon' : 'Both',
      sundayWorkOptionStr: data.sundayWorkOption === '0' ? 'Morning' : data.sundayWorkOption === '1' ? 'Afternoon' : 'Both',
      updatedAt: new Date().toISOString(),
      rowVersion: data.rowVersion
    };
  },
  
  deletePositionReq: async (id: UUID): Promise<void> => {
    await delay(300);
    const index = dummyPositionRequirements.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Requirement not found');
    dummyPositionRequirements.splice(index, 1);
  },
};

// Lookup Services with dummy data
export const lookupService = {
  // Education Levels
  getAllEducationLevels: async (): Promise<EducationLevelDto[]> => {
    await delay(500);
    return [...dummyEducationLevels];
  },
  
  // Profession Types
  getAllProfessionTypes: async (): Promise<ProfessionTypeDto[]> => {
    await delay(500);
    return [...dummyProfessionTypes];
  },
  
  // Benefit Settings
  getAllBenefitSettings: async (): Promise<BenefitSettingDto[]> => {
    await delay(500);
    return [...dummyBenefitSettings];
  },
};