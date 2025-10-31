import type { UUID } from "crypto";
import type { AddressType, EmpNature, EmpType, Gender, MaritalStat, YesNo } from "../enum";

export interface Step1Dto {
    firstName: string;
    firstNameAm: string;
    middleName: string;
    middleNameAm: string; // Fixed: was liddleNameAm
    lastName: string;
    lastNameAm: string;
    nationality: string;
    gender: Gender;
    employmentDate: string;
    jobGradeId: UUID;
    positionId: UUID;
    departmentId: UUID;
    employmentType: EmpType;
    employmentNature: EmpNature;
    File: File | null; // Fixed: proper File type
}

export interface Step2Dto {
    birthDate: string;
    birthLocation: string;
    motherFullName: string;
    hasBirthCert: YesNo;
    hasMarriageCert: YesNo;
    maritalStatus: MaritalStat;
    employeeId: UUID;
    tin: string;
    bankAccountNo: string;
    pensionNumber: string;
    addressType: AddressType;
    addressTypeStr: string;
    country: string;
    region: string;
    subcity: string;
    zone: string;
    woreda: string;
    kebele: string;
    houseNo: string;
    telephone: string;
    poBox: string;
    fax: string;
    email: string;
    website: string;
}

export interface Step3Dto {
    firstName: string;
    firstNameAm: string;
    middleName: string;
    middleNameAm: string; // Fixed: was liddleNameAm
    lastName: string;
    lastNameAm: string;
    nationality: string;
    gender: Gender;
    relationId: UUID;
    employeeId: UUID;
    addressType: AddressType;
    addressTypeStr: string;
    country: string;
    region: string;
    subcity: string;
    zone: string;
    woreda: string;
    kebele: string;
    houseNo: string;
    telephone: string;
    poBox: string;
    fax: string;
    email: string;
    website: string;
}

export interface Step4Dto {
    firstName: string;
    firstNameAm: string;
    middleName: string;
    middleNameAm: string; // Fixed: was liddleNameAm
    lastName: string;
    lastNameAm: string;
    nationality: string;
    gender: Gender;
    relationId: UUID;
    employeeId: UUID;
    addressType: AddressType;
    addressTypeStr: string;
    country: string;
    region: string;
    subcity: string;
    zone: string;
    woreda: string;
    kebele: string;
    houseNo: string;
    telephone: string;
    poBox: string;
    fax: string;
    email: string;
    website: string;
    File: File | null; // Fixed: proper File type
}

export interface EmpAddRes {
    id: UUID;
}