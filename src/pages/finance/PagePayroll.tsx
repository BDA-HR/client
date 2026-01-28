import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PayrollHeader from '../../components/finance/payroll/PayrollHeader';
import { PayrollSearchFilters } from '../../components/finance/payroll/PayrollSearchFilters';
import { PayrollQuickActions } from '../../components/finance/payroll/PayrollQuickActions';
import PayrollTable from '../../components/finance/payroll/PayrollTable';
// Import AddEmployeeModal, ProcessPayrollModal, etc.

interface PayrollItem {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  salary: number;
  benefits: number;
  deductions: number;
  netPay: number;
  status: 'Active' | 'On Leave' | 'Pending' | 'Terminated';
  lastPayDate: string;
  nextPayDate: string;
}

function PagePayroll() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample payroll data
  const payrollData: PayrollItem[] = [
    { id: 1, employeeId: 'EMP-001', name: 'John Smith', department: 'IT', position: 'Senior Developer', salary: 85000, benefits: 12000, deductions: 15000, netPay: 82000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
    { id: 2, employeeId: 'EMP-002', name: 'Sarah Johnson', department: 'HR', position: 'HR Manager', salary: 75000, benefits: 10000, deductions: 14000, netPay: 71000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
    { id: 3, employeeId: 'EMP-003', name: 'Michael Chen', department: 'Finance', position: 'Financial Analyst', salary: 68000, benefits: 9000, deductions: 12500, netPay: 64500, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
    { id: 4, employeeId: 'EMP-004', name: 'Emily Davis', department: 'Sales', position: 'Sales Manager', salary: 92000, benefits: 15000, deductions: 18000, netPay: 89000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
    { id: 5, employeeId: 'EMP-005', name: 'Robert Wilson', department: 'Operations', position: 'Operations Director', salary: 110000, benefits: 20000, deductions: 22000, netPay: 108000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
    { id: 6, employeeId: 'EMP-006', name: 'Lisa Brown', department: 'Marketing', position: 'Marketing Specialist', salary: 62000, benefits: 8000, deductions: 11500, netPay: 58500, status: 'On Leave', lastPayDate: '2024-01-31', nextPayDate: '2024-03-01' },
    { id: 7, employeeId: 'EMP-007', name: 'David Miller', department: 'Engineering', position: 'Lead Engineer', salary: 95000, benefits: 14000, deductions: 17000, netPay: 92000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
    { id: 8, employeeId: 'EMP-008', name: 'Jessica Taylor', department: 'IT', position: 'System Administrator', salary: 72000, benefits: 9500, deductions: 13500, netPay: 68000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
    { id: 9, employeeId: 'EMP-009', name: 'Thomas Anderson', department: 'Finance', position: 'Accountant', salary: 58000, benefits: 7500, deductions: 10500, netPay: 55000, status: 'Pending', lastPayDate: '2024-01-15', nextPayDate: '2024-02-01' },
    { id: 10, employeeId: 'EMP-010', name: 'Amanda Rodriguez', department: 'Sales', position: 'Account Executive', salary: 88000, benefits: 13000, deductions: 16000, netPay: 85000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15' },
  ];

  // Filter data based on search term and filters
  const filteredPayroll = payrollData.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'All' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Handler functions
  const handleViewDetails = (item: PayrollItem) => {
    console.log('View employee details:', item);
    // Implement view details logic
  };

  const handleEdit = (item: PayrollItem) => {
    console.log('Edit employee:', item);
    // Implement edit logic
  };

  const handleProcessPayroll = (item: PayrollItem) => {
    console.log('Process payroll for:', item);
    // Implement payroll processing logic
  };

  const handleGeneratePayslip = (item: PayrollItem) => {
    console.log('Generate payslip for:', item);
    // Implement payslip generation logic
  };

  const handleAddEmployee = () => {
    console.log('Add employee clicked');
    // Open add employee modal
  };

  const handleProcessPayrollBulk = () => {
    console.log('Process payroll bulk clicked');
    // Open payroll processing modal
  };

  const handleCalculateTax = () => {
    console.log('Calculate tax clicked');
    // Open tax calculation tool
  };

  const handleGenerateReports = () => {
    console.log('Generate reports clicked');
    // Open report generation
  };

  const handleManageBenefits = () => {
    console.log('Manage benefits clicked');
    // Open benefits management
  };

  const handleExportPayslips = () => {
    console.log('Export payslips clicked');
    // Handle export
  };

  const handleExport = () => {
    console.log('Export data');
    // Implement export logic
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PayrollHeader />      
      <PayrollQuickActions
        onAddEmployee={handleAddEmployee}
        onProcessPayroll={handleProcessPayrollBulk}
        onCalculateTax={handleCalculateTax}
        onGenerateReports={handleGenerateReports}
        onManageBenefits={handleManageBenefits}
        onExportPayslips={handleExportPayslips}
      />

      <PayrollSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onProcessPayroll={handleProcessPayrollBulk}
        onExport={handleExport}
      />

      <PayrollTable
        data={filteredPayroll}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredPayroll.length / 10)}
        totalItems={filteredPayroll.length}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onProcessPayroll={handleProcessPayroll}
        onGeneratePayslip={handleGeneratePayslip}
      />
    </motion.div>
  );
}

export default PagePayroll;