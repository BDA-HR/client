import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEmployeeStepForm } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepForm';
import { Gender, EmpType, EmpNature } from '../../../types/hr/enum';

export const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToEmployees = () => {
    navigate('/hr/employees/record');
  };

  const handleEmployeeAdded = (result: any) => {
    console.log('Employee added successfully:', result);
    
    // Get the form data from localStorage or sessionStorage
    const formData = JSON.parse(localStorage.getItem('employeeFormData') || '{}');
    const step1Data = formData.step1 || {};
    
    // Helper function to get enum display value
    const getEnumDisplayValue = (enumObj: any, value: string) => {
      return enumObj[value as keyof typeof enumObj] || value;
    };

    // Construct proper names
    const empFullName = `${step1Data.firstName || ''} ${step1Data.middleName || ''} ${step1Data.lastName || ''}`.trim();
    const empFullNameAm = `${step1Data.firstNameAm || ''} ${step1Data.middleNameAm || ''} ${step1Data.lastNameAm || ''}`.trim();

    // Format employment date
    const employmentDate = step1Data.employmentDate || new Date().toISOString().split('T')[0];
    const employmentDateStr = new Date(employmentDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    // Create a properly formatted employee object that matches EmployeeListDto
    const newEmployee = {
      id: result.id || `emp-${Date.now()}`,
      code: result.code || `EMP${Date.now().toString().slice(-6)}`,
      empFullName: empFullName,
      empFullNameAm: empFullNameAm,
      gender: step1Data.gender || '0',
      genderStr: getEnumDisplayValue(Gender, step1Data.gender) || 'Male',
      nationality: step1Data.nationality || 'Ethiopian',
      employmentDate: employmentDate,
      employmentDateStr: employmentDateStr,
      companyId: step1Data.companyId || '',
      companyName: step1Data.companyName || '',
      branchId: step1Data.branchId || '',
      branchName: step1Data.branchName || '',
      jobGradeId: step1Data.jobGradeId || '',
      jobGrade: step1Data.jobGrade || '',
      positionId: step1Data.positionId || '',
      position: step1Data.position || '',
      departmentId: step1Data.departmentId || '',
      department: step1Data.department || '',
      employmentType: step1Data.employmentType || '0',
      employmentTypeStr: getEnumDisplayValue(EmpType, step1Data.employmentType) || 'New Opening',
      employmentNature: step1Data.employmentNature || '0',
      employmentNatureStr: getEnumDisplayValue(EmpNature, step1Data.employmentNature) || 'Permanent',
      status: 'active' as const,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: 'System',
      isTerminated: '0',
      isApproved: '0',
      isStandBy: '0',
      isRetired: '0',
      isUnderProbation: '0'
    };

    console.log('New employee created:', newEmployee);

    // Store in localStorage for persistence
    try {
      const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      const updatedEmployees = [newEmployee, ...existingEmployees];
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      
      // Clear the form data from localStorage
      localStorage.removeItem('employeeFormData');
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }

    // Store in sessionStorage for immediate access
    sessionStorage.setItem('newEmployee', JSON.stringify(newEmployee));
    sessionStorage.setItem('employeeAdded', 'true');

    // Navigate back to employees list
    navigate('/hr/employees/record');
  };

  return (
    <div>
      <AddEmployeeStepForm
        onBackToEmployees={handleBackToEmployees}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
};

export default AddEmployeePage;