import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEmployeeStepForm } from '../../../components/hr/employee/AddEmployee/AddEmployeeStepForm';

export const AddEmployeePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToEmployees = () => {
    navigate('/hr/employees/record');
  };

  const handleEmployeeAdded = (result: any) => {
    console.log('Employee added successfully:', result);
    
    // Create a properly formatted employee object that matches EmployeeListDto
    const newEmployee = {
      id: result.id || `emp-${Date.now()}`,
      code: result.code || `EMP${Date.now().toString().slice(-6)}`,
      empFullName: result.empFullName || `${result.firstName} ${result.lastName}`,
      empFullNameAm: result.empFullNameAm || '',
      gender: result.gender || '0',
      genderStr: result.genderStr || 'Male',
      nationality: result.nationality || 'Ethiopian',
      employmentDate: result.employmentDate || new Date().toISOString().split('T')[0],
      employmentDateStr: result.employmentDateStr || new Date().toLocaleDateString(),
      companyId: result.companyId || '',
      companyName: result.companyName || '',
      branchId: result.branchId || '',
      branchName: result.branchName || '',
      jobGradeId: result.jobGradeId || '',
      jobGrade: result.jobGrade || '',
      positionId: result.positionId || '',
      position: result.position || '',
      departmentId: result.departmentId || '',
      department: result.department || '',
      employmentType: result.employmentType || '0',
      employmentTypeStr: result.employmentTypeStr || 'New Opening',
      employmentNature: result.employmentNature || '0',
      employmentNatureStr: result.employmentNatureStr || 'Permanent',
      status: 'active' as const,
      createdAt: result.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: result.updatedAt || new Date().toISOString().split('T')[0],
      updatedBy: result.updatedBy || 'System',
      isTerminated: result.isTerminated || '0',
      isApproved: result.isApproved || '0',
      isStandBy: result.isStandBy || '0',
      isRetired: result.isRetired || '0',
      isUnderProbation: result.isUnderProbation || '0'
    };

    // Store in localStorage for persistence
    try {
      const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
      const updatedEmployees = [newEmployee, ...existingEmployees];
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
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