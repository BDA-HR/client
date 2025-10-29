import type { UUID } from "crypto";
import type { AddressType, EmpNature, EmpType, Gender, MaritalStat, YesNo } from "../enum";

export interface Step1Dto {
    firstName: string;
    firstNameAm: string;
    middleName: string;
    liddleNameAm: string;
    lastName: string;
    lastNameAm: string;
    nationality: string;
    gender: Gender; //enum.Gender (0/1)

    employmentDate: string;
    jobGradeId: UUID; //Cor.HRMM.JobGrade
    positionId: UUID; //Cor.HRMM.Position
    departmentId: UUID; //Cor.Module.Department
    employmentType: EmpType; //enum.EmpType (0/1)
    employmentNature: EmpNature; //enum.EmpNature (0/1)
    // IFormFile File { get; set; } = default!; for employee photo input id/name should be 'File'
}

export interface Step2Dto {
    birthDate: string;
    birthLocation: string;
    motherFullName: string;
    hasBirthCert: YesNo; //enum.YesNo (0/1)
    hasMarriageCert: YesNo; //enum.YesNo (0/1)
    maritalStatus: MaritalStat; //enum.MaritalStat (0/1)
    employeeId: UUID; //Employee 
    tin: string;
    bankAccountNo: string;
    pensionNumber: string;
    addressType: AddressType; //enum.AddressType (0/1)
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
    liddleNameAm: string;
    lastName: string;
    lastNameAm: string;
    nationality: string;
    gender: Gender; //enum.Gender (0/1)
    relationId: UUID; //lup.Relation 
    employeeId: UUID; //Employee 
    addressType: AddressType; //enum.AddressType (0/1)
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
    liddleNameAm: string;
    lastName: string;
    lastNameAm: string;
    nationality: string;
    gender: Gender; //enum.Gender (0/1)
    relationId: UUID; //lup.Relation 
    employeeId: UUID; //Employee 
    addressType: AddressType; //enum.AddressType (0/1)
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
    // IFormFile File { get; set; } = default!; for Guarantor file input id/name should be 'File'
}

export interface EmpAddRes {
    id: UUID; //Employee Id
}