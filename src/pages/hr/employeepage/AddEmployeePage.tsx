import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building } from 'lucide-react';
import type { UUID } from 'crypto';

// Import components
import { AddEmployeeStepHeader } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepHeader';
import { AddEmployeeStepForm } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepForm';
import type { EmployeeAddDto, JobGradeDto, DepartmentDto, EmploymentTypeDto, EmploymentNatureDto, PositionDto } from '../../../types/hr/employee';

// Mock data for mapping (same as in the form)
const mockJobGrades: JobGradeDto[] = [
  { id: '1' as UUID, name: 'Grade 1', nameAm: 'ግሬድ 1' },
  { id: '2' as UUID, name: 'Grade 2', nameAm: 'ግሬድ 2' },
  { id: '3' as UUID, name: 'Grade 3', nameAm: 'ግሬድ 3' },
];

const mockDepartments: DepartmentDto[] = [
  { id: '1' as UUID, name: 'Engineering', nameAm: 'ኢንጂነሪንግ' },
  { id: '2' as UUID, name: 'Human Resources', nameAm: 'ሰው ሀብት' },
  { id: '3' as UUID, name: 'Finance', nameAm: 'ፋይናንስ' },
  { id: '4' as UUID, name: 'Marketing', nameAm: 'ግብይት' },
  { id: '5' as UUID, name: 'Operations', nameAm: 'ኦፕሬሽን' },
];

const mockPositions: PositionDto[] = [
  { id: '1' as UUID, name: 'Software Engineer', nameAm: 'ሶፍትዌር ኢንጂነር' },
  { id: '2' as UUID, name: 'Senior Software Engineer', nameAm: 'ከፍተኛ ሶፍትዌር ኢንጂነር' },
  { id: '3' as UUID, name: 'HR Manager', nameAm: 'ሰው ሀብት ማኔጅር' },
  { id: '4' as UUID, name: 'Finance Analyst', nameAm: 'ፋይናንስ አናላይዝር' },
  { id: '5' as UUID, name: 'Marketing Specialist', nameAm: 'ግብይት ስፔሻሊስት' },
  { id: '6' as UUID, name: 'Operations Manager', nameAm: 'ኦፕሬሽንስ ማኔጅር' },
  { id: '7' as UUID, name: 'Product Manager', nameAm: 'ምርት ማኔጅር' },
  { id: '8' as UUID, name: 'Data Scientist', nameAm: 'ዳታ ሳይንቲስት' },
];

const mockEmploymentTypes: EmploymentTypeDto[] = [
  { id: '1' as UUID, name: 'Full-time', nameAm: 'ሙሉ ጊዜ' },
  { id: '2' as UUID, name: 'Part-time', nameAm: 'ከፊል ጊዜ' },
  { id: '3' as UUID, name: 'Contract', nameAm: 'ኮንትራት' },
];

const mockEmploymentNatures: EmploymentNatureDto[] = [
  { id: '1' as UUID, name: 'Permanent', nameAm: 'ቋሚ' },
  { id: '2' as UUID, name: 'Temporary', nameAm: 'ጊዜያዊ' },
  { id: '3' as UUID, name: 'Probation', nameAm: 'ሙከራ' },
];

const initialValues: EmployeeAddDto = {
  firstName: '',
  firstNameAm: '',
  middleName: '',
  middleNameAm: '',
  lastName: '',
  lastNameAm: '',
  gender: '' as '0' | '1',
  nationality: 'Ethiopian',
  employmentDate: new Date().toISOString().split('T')[0],
  jobGradeId: '' as UUID,
  positionId: '' as UUID,
  departmentId: '' as UUID,
  employmentTypeId: '' as UUID,
  employmentNatureId: '' as UUID,
};

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Review', icon: Building },
];

const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [snapshot, setSnapshot] = useState<EmployeeAddDto>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackToEmployees = () => {
    navigate(-1);
  };

  const handleNext = (values: EmployeeAddDto) => {
    setSnapshot(values);
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const handleBack = (values: EmployeeAddDto) => {
    setSnapshot(values);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async (values: EmployeeAddDto, actions: any) => {
    if (currentStep === steps.length - 1) {
      await submitForm(values, actions);
    } else {
      actions.setTouched({});
      actions.setSubmitting(false);
      handleNext(values);
    }
  };

  const submitForm = async (values: EmployeeAddDto, actions: any) => {
    setIsSubmitting(true);
    try {
      console.log('Form submitted:', values);
      
      // Construct the full names from the individual name parts
      const empFullName = `${values.firstName}${values.middleName ? ` ${values.middleName}` : ''} ${values.lastName}`.trim();
      const empFullNameAm = `${values.firstNameAm}${values.middleNameAm ? ` ${values.middleNameAm}` : ''} ${values.lastNameAm}`.trim();

      // Get display names from IDs
      const jobGrade = mockJobGrades.find(g => g.id === values.jobGradeId)?.name || 'G1';
      const department = mockDepartments.find(d => d.id === values.departmentId)?.name || 'General';
      const position = mockPositions.find(p => p.id === values.positionId)?.name || 'Employee';
      const employmentType = mockEmploymentTypes.find(t => t.id === values.employmentTypeId)?.name || 'Full-time';
      const employmentNature = mockEmploymentNatures.find(n => n.id === values.employmentNatureId)?.name || 'Permanent';
      const genderStr = values.gender === '1' ? 'Male' : 'Female';

      // Generate employee code
      const employeeCode = `EMP${Date.now().toString().slice(-6)}`;
      
      // Format dates properly
      const employmentDateObj = new Date(values.employmentDate);
      const employmentDateStr = employmentDateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const currentDate = new Date();
      const createdAt = currentDate.toISOString().split('T')[0];
      const updatedAt = currentDate.toISOString().split('T')[0];

      // Create the employee data in the format expected by EmployeeManagementPage
      const newEmployee = {
        // Basic employee info
        id: `emp-${Date.now()}` as UUID,
        personId: `person-${Date.now()}` as UUID,
        code: employeeCode,
        
        // Personal information
        empFullName: empFullName,
        empFullNameAm: empFullNameAm,
        gender: values.gender,
        genderStr: genderStr,
        nationality: values.nationality,
        
        // Employment details
        employmentDate: values.employmentDate,
        employmentDateStr: employmentDateStr,
        employmentDateStrAm: employmentDateStr, // You might want different formatting for Amharic
        jobGradeId: values.jobGradeId,
        jobGrade: jobGrade,
        positionId: values.positionId,
        position: position,
        departmentId: values.departmentId,
        department: department,
        employmentTypeId: values.employmentTypeId,
        employmentType: employmentType,
        employmentNatureId: values.employmentNatureId,
        employmentNature: employmentNature,
        
        // System info
        status: 'active' as "active" | "on-leave",
        createdAt: createdAt,
        updatedAt: updatedAt,
        updatedBy: 'System'
      };

      console.log('New employee created:', newEmployee);
      
      // Store the employee data in sessionStorage
      sessionStorage.setItem('newEmployee', JSON.stringify(newEmployee));
      
      // Simulate API call delay
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
  );
};

export default AddEmployeePage;