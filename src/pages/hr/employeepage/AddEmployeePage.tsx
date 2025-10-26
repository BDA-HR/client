import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import type { UUID } from 'crypto';

// Import components
import { AddEmployeeStepHeader } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepHeader';
import { AddEmployeeStepForm } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepForm';

// Define the extended interface locally to match the form - UPDATED STRUCTURE
interface ExtendedEmployeeData {
  // Basic info
  firstName: string;
  firstNameAm: string;
  middleName: string;
  middleNameAm: string;
  lastName: string;
  lastNameAm: string;
  gender: '0' | '1' | '';
  nationality: string;
  employmentDate: string;
  companyId: UUID;
  branchId: UUID;
  jobGradeId: UUID;
  positionId: UUID;
  departmentId: UUID;
  employmentTypeId: UUID;
  employmentNatureId: UUID;
  
  // Biographical data - NESTED STRUCTURE
  biographicalData: {
    birthDate: string;
    birthLocation: string;
    motherFullName: string;
    hasBirthCert: '0' | '1' | '';
    hasMarriageCert: '0' | '1' | '';
    maritalStatusId: UUID;
    addressId: UUID;
  };
  
  // Financial data - NESTED STRUCTURE
  financialData: {
    tin: string;
    bankAccountNo: string;
    pensionNumber: string;
  };
  
  // Arrays
  emergencyContacts: Array<{
    firstName: string;
    firstNameAm: string;
    middleName: string;
    middleNameAm: string;
    lastName: string;
    lastNameAm: string;
    gender: '0' | '1' | '';
    nationality: string;
    relationId: UUID;
    addressId: UUID;
  }>;
  familyMembers: Array<{
    firstName: string;
    firstNameAm: string;
    middleName: string;
    middleNameAm: string;
    lastName: string;
    lastNameAm: string;
    gender: '0' | '1' | '';
    nationality: string;
    relationId: UUID;
  }>;
  guarantors: Array<{
    firstName: string;
    firstNameAm: string;
    middleName: string;
    middleNameAm: string;
    lastName: string;
    lastNameAm: string;
    gender: '0' | '1' | '';
    nationality: string;
    relationId: UUID;
    addressId: UUID;
  }>;
  
  // File uploads
  guarantorFiles: File[];
  stampFiles: File[];
  signatureFiles: File[];
  
  // Employment state
  isTerminated: '0' | '1';
  isApproved: '0' | '1';
  isStandBy: '0' | '1';
  isRetired: '0' | '1';
  isUnderProbation: '0' | '1';
}

const initialValues: ExtendedEmployeeData = {
  // Basic info
  firstName: '',
  firstNameAm: '',
  middleName: '',
  middleNameAm: '',
  lastName: '',
  lastNameAm: '',
  gender: '' as '0' | '1' | '',
  nationality: 'Ethiopian',
  employmentDate: new Date().toISOString().split('T')[0],
  companyId: '' as UUID,
  branchId: '' as UUID,
  jobGradeId: '' as UUID,
  positionId: '' as UUID,
  departmentId: '' as UUID,
  employmentTypeId: '' as UUID,
  employmentNatureId: '' as UUID,
  
  // Biographical data - NESTED STRUCTURE
  biographicalData: {
    birthDate: '',
    birthLocation: '',
    motherFullName: '',
    hasBirthCert: '' as '0' | '1' | '',
    hasMarriageCert: '' as '0' | '1' | '',
    maritalStatusId: '' as UUID,
    addressId: '' as UUID,
  },
  
  // Financial data - NESTED STRUCTURE
  financialData: {
    tin: '',
    bankAccountNo: '',
    pensionNumber: '',
  },
  
  // Arrays
  emergencyContacts: [],
  familyMembers: [],
  guarantors: [],
  
  // File uploads
  guarantorFiles: [],
  stampFiles: [],
  signatureFiles: [],
  
  // Employment state
  isTerminated: '0',
  isApproved: '0',
  isStandBy: '0',
  isRetired: '0',
  isUnderProbation: '0',
};

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Biographical', icon: Users },
  { id: 3, title: 'Financial', icon: DollarSign },
  { id: 4, title: 'Review', icon: CheckCircle2 },
];

// Mock data for dropdowns (you can move these to a separate file if needed)
const mockCompanies = [
  { id: '1' as UUID, name: 'Main Company', nameAm: 'ዋና ኩባንያ' },
  { id: '2' as UUID, name: 'Subsidiary A', nameAm: 'ንዑስ ኩባንያ አ' },
  { id: '3' as UUID, name: 'Subsidiary B', nameAm: 'ንዑስ ኩባንያ ለ' },
];

const mockBranches = [
  { id: '1' as UUID, name: 'Head Office', nameAm: 'ዋና ቢሮ', companyId: '1' as UUID },
  { id: '2' as UUID, name: 'Branch A', nameAm: 'ቅርንጫፍ አ', companyId: '1' as UUID },
  { id: '3' as UUID, name: 'Branch B', nameAm: 'ቅርንጫፍ ለ', companyId: '1' as UUID },
];

const mockJobGrades = [
  { id: '1' as UUID, name: 'Grade 1', nameAm: 'ግሬድ 1' },
  { id: '2' as UUID, name: 'Grade 2', nameAm: 'ግሬድ 2' },
  { id: '3' as UUID, name: 'Grade 3', nameAm: 'ግሬድ 3' },
];

const mockDepartments = [
  { id: '1' as UUID, name: 'Engineering', nameAm: 'ኢንጂነሪንግ', branchId: '1' as UUID },
  { id: '2' as UUID, name: 'Human Resources', nameAm: 'ሰው ሀብት', branchId: '1' as UUID },
  { id: '3' as UUID, name: 'Finance', nameAm: 'ፋይናንስ', branchId: '1' as UUID },
];

const mockPositions = [
  { id: '1' as UUID, name: 'Software Engineer', nameAm: 'ሶፍትዌር ኢንጂነር', departmentId: '1' as UUID },
  { id: '2' as UUID, name: 'Senior Software Engineer', nameAm: 'ከፍተኛ ሶፍትዌር ኢንጂነር', departmentId: '1' as UUID },
  { id: '3' as UUID, name: 'HR Manager', nameAm: 'ሰው ሀብት ማኔጅር', departmentId: '2' as UUID },
];

const mockEmploymentTypes = [
  { id: '1' as UUID, name: 'Full-time', nameAm: 'ሙሉ ጊዜ' },
  { id: '2' as UUID, name: 'Part-time', nameAm: 'ከፊል ጊዜ' },
  { id: '3' as UUID, name: 'Contract', nameAm: 'ኮንትራት' },
];

const mockEmploymentNatures = [
  { id: '1' as UUID, name: 'Permanent', nameAm: 'ቋሚ' },
  { id: '2' as UUID, name: 'Temporary', nameAm: 'ጊዜያዊ' },
  { id: '3' as UUID, name: 'Probation', nameAm: 'ሙከራ' },
];

const mockMaritalStatus = [
  { id: '1' as UUID, name: 'Single', nameAm: 'ያላገባ' },
  { id: '2' as UUID, name: 'Married', nameAm: 'ያገባ' },
  { id: '3' as UUID, name: 'Divorced', nameAm: 'የተፋታ' },
  { id: '4' as UUID, name: 'Widowed', nameAm: 'የተመሰረተ' },
];

const mockAddresses = [
  { id: '1' as UUID, name: 'Main Office', nameAm: 'ዋና አድራሻ', fullAddress: 'Addis Ababa, Ethiopia' },
  { id: '2' as UUID, name: 'Branch Office', nameAm: 'ቅርንጫፍ አድራሻ', fullAddress: 'Addis Ababa, Ethiopia' },
];

const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [snapshot, setSnapshot] = useState<ExtendedEmployeeData>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackToEmployees = () => {
    navigate(-1);
  };

  const handleNext = (values: ExtendedEmployeeData) => {
    setSnapshot(values);
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handleBack = (values: ExtendedEmployeeData) => {
    setSnapshot(values);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async (values: ExtendedEmployeeData, actions: any) => {
    if (currentStep === steps.length - 1) {
      await submitForm(values, actions);
    } else {
      actions.setTouched({});
      actions.setSubmitting(false);
      handleNext(values);
    }
  };

  const submitForm = async (values: ExtendedEmployeeData, actions: any) => {
    setIsSubmitting(true);
    try {
      console.log('Form submitted:', values);
      
      // Construct the full names
      const empFullName = `${values.firstName}${values.middleName ? ` ${values.middleName}` : ''} ${values.lastName}`.trim();
      const empFullNameAm = `${values.firstNameAm}${values.middleNameAm ? ` ${values.middleNameAm}` : ''} ${values.lastNameAm}`.trim();

      // Generate employee code
      const employeeCode = `EMP${Date.now().toString().slice(-6)}`;
      
      // Format dates
      const employmentDateObj = new Date(values.employmentDate);
      const employmentDateStr = employmentDateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const currentDate = new Date();
      const createdAt = currentDate.toISOString().split('T')[0];
      const updatedAt = currentDate.toISOString().split('T')[0];

      // Get actual values from mock data
      const company = mockCompanies.find(c => c.id === values.companyId);
      const branch = mockBranches.find(b => b.id === values.branchId);
      const department = mockDepartments.find(d => d.id === values.departmentId);
      const position = mockPositions.find(p => p.id === values.positionId);
      const jobGrade = mockJobGrades.find(g => g.id === values.jobGradeId);
      const employmentType = mockEmploymentTypes.find(t => t.id === values.employmentTypeId);
      const employmentNature = mockEmploymentNatures.find(n => n.id === values.employmentNatureId);
      const maritalStatus = mockMaritalStatus.find(m => m.id === values.biographicalData.maritalStatusId);
      const address = mockAddresses.find(a => a.id === values.biographicalData.addressId);

      // Create the employee data
      const newEmployee = {
        id: `emp-${Date.now()}` as UUID,
        personId: `person-${Date.now()}` as UUID,
        code: employeeCode,
        
        // Personal information
        empFullName: empFullName,
        empFullNameAm: empFullNameAm,
        gender: values.gender,
        genderStr: values.gender === '0' ? 'Male' : values.gender === '1' ? 'Female' : 'Not specified',
        nationality: values.nationality,
        
        // Employment details
        employmentDate: values.employmentDate,
        employmentDateStr: employmentDateStr,
        employmentDateStrAm: employmentDateStr,
        companyId: values.companyId,
        companyName: company?.name || '',
        branchId: values.branchId,
        branchName: branch?.name || '',
        jobGradeId: values.jobGradeId,
        jobGrade: jobGrade?.name || '',
        positionId: values.positionId,
        position: position?.name || '',
        departmentId: values.departmentId,
        department: department?.name || '',
        employmentTypeId: values.employmentTypeId,
        employmentType: employmentType?.name || '',
        employmentNatureId: values.employmentNatureId,
        employmentNature: employmentNature?.name || '',
        
        // Additional biographical data - ACCESS NESTED DATA
        birthDate: values.biographicalData.birthDate,
        birthLocation: values.biographicalData.birthLocation,
        motherFullName: values.biographicalData.motherFullName,
        hasBirthCert: values.biographicalData.hasBirthCert,
        hasMarriageCert: values.biographicalData.hasMarriageCert,
        maritalStatusId: values.biographicalData.maritalStatusId,
        maritalStatus: maritalStatus?.name || '',
        addressId: values.biographicalData.addressId,
        address: address?.name || '',
        
        // Financial data - ACCESS NESTED DATA
        tin: values.financialData.tin,
        bankAccountNo: values.financialData.bankAccountNo,
        pensionNumber: values.financialData.pensionNumber,
        
        // Arrays
        emergencyContacts: values.emergencyContacts,
        familyMembers: values.familyMembers,
        guarantors: values.guarantors,
        
        // File uploads
        guarantorFiles: values.guarantorFiles,
        stampFiles: values.stampFiles,
        signatureFiles: values.signatureFiles,
        
        // System info
        status: 'active' as const,
        createdAt: createdAt,
        updatedAt: updatedAt,
        updatedBy: 'System',
        
        // Employment state
        isTerminated: values.isTerminated,
        isApproved: values.isApproved,
        isStandBy: values.isStandBy,
        isRetired: values.isRetired,
        isUnderProbation: values.isUnderProbation,
      };

      console.log('New employee created:', newEmployee);
      
      // Store the employee data
      sessionStorage.setItem('newEmployee', JSON.stringify(newEmployee));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate back to employees list
      navigate(-1);
    } catch (error) {
      console.error('Submission error:', error);
      actions.setSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header Component */}
        <AddEmployeeStepHeader
          steps={steps}
          currentStep={currentStep}
          onBack={handleBackToEmployees}
          title="Add New Employee"
          backButtonText="Back to Employees"
        />

        {/* Form Component */}
        <div className="mt-8">
          <AddEmployeeStepForm
            currentStep={currentStep}
            totalSteps={steps.length}
            snapshot={snapshot}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEmployeePage;