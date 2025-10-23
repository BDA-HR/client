import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building } from 'lucide-react';
import type { UUID } from 'crypto';

// Import components
import { AddEmployeeStepHeader } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepHeader';
import { AddEmployeeStepForm } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepForm';
import type { EmployeeAddDto, JobGradeDto, DepartmentDto, EmploymentTypeDto } from '../../../types/hr/employee';

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

const mockEmploymentTypes: EmploymentTypeDto[] = [
  { id: '1' as UUID, name: 'Full-time', nameAm: 'ሙሉ ጊዜ' },
  { id: '2' as UUID, name: 'Part-time', nameAm: 'ከፊል ጊዜ' },
  { id: '3' as UUID, name: 'Contract', nameAm: 'ኮንትራት' },
];


const initialValues: EmployeeAddDto = {
  firstName: '',
  firstNameAm: '',
  middleName: '',
  middleNameAm: '',
  lastName: '',
  lastNameAm: '',
  gender: '1' as '0' | '1',
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
      
      // Map the form data to the expected Employee type
      const newEmployee = {
        // Personal Information
        id: `emp-${Date.now()}`,
        employeeId: `EMP${Date.now().toString().slice(-6)}`,
        firstName: values.firstName,
        middleName: values.middleName || '',
        lastName: values.lastName,
        email: `${values.firstName.toLowerCase()}.${values.lastName.toLowerCase()}@company.com`,
        role: 'Employee',
        phone: '+251-XXX-XXXX',
        address: 'Address to be updated',
        city: 'City to be updated',
        state: 'State to be updated',
        postalCode: '00000',
        country: values.nationality,
        dateOfBirth: '1990-01-01',
        gender: values.gender === '1' ? 'Male' : 'Female',
        maritalStatus: 'Single',
        
        // Emergency Contact
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Spouse',
          phone: '+251-XXX-XXXX'
        },
        
        // Employment Details - Map IDs to actual names
        department: mockDepartments.find(d => d.id === values.departmentId)?.name || 'Engineering',
        jobTitle: values.positionId,
        jobGrade: mockJobGrades.find(g => g.id === values.jobGradeId)?.name || 'Grade 1',
        employeeCategory: 'Professional',
        reportingTo: 'Manager Name',
        manager: 'Manager Name',
        team: 'Development Team',
        joiningDate: values.employmentDate,
        contractType: mockEmploymentTypes.find(t => t.id === values.employmentTypeId)?.name || 'Full-time',
        employmentStatus: 'Active',
        status: 'active' as 'active' | 'on-leave',
        workLocation: 'Main Office',
        workSchedule: '9 AM - 6 PM',
        
        // Compensation
        salary: 50000,
        currency: 'USD',
        paymentMethod: 'Bank Transfer',
        bankDetails: {
          bankName: 'Commercial Bank',
          accountNumber: '****1234',
          branchCode: 'CBET'
        },
        taxInformation: 'Tax info to be updated',
        
        // Time & Attendance
        lastCheckIn: '09:00 AM',
        lastCheckOut: '06:00 PM',
        totalLeavesTaken: 0,
        leaveBalance: 21,
        attendancePercentage: 100,
        
        // Performance
        performanceRating: 0,
        lastAppraisalDate: '',
        nextAppraisalDate: '',
        keyPerformanceIndicators: [],
        skills: [],
        competencies: [],
        
        // Training & Development
        trainings: [],
        previousRoles: [],
        documents: [],
        
        // System
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: 'HR Manager'
      };

      // Store the mapped employee data in sessionStorage
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
    <div className="min-h-screen8">
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