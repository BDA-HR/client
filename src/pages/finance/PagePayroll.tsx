import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { DollarSign, Users, BarChart, FileCheck } from 'lucide-react';
import PayrollHeader from '../../components/finance/payroll/PayrollHeader';
import { PayrollSearchFilters } from '../../components/finance/payroll/PayrollSearchFilters';
import { PayrollQuickActions } from '../../components/finance/payroll/PayrollQuickActions';
import PayrollTable from '../../components/finance/payroll/PayrollTable';
import AddPayrollModal from '../../components/finance/payroll/AddPayrollModal';
import type { JobGradeListDto } from '../../types/hr/jobgrade';
import ProcessPayrollModal from '../../components/finance/payroll/ProcessPayroll';

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
  jobGradeId?: string;
  jobGradeName?: string;
}

const sampleJobGrades: JobGradeListDto[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'G7 - Senior Software Developer',
    startSalary: 85000,
    maxSalary: 110000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'G6 - Software Developer',
    startSalary: 70000,
    maxSalary: 95000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'G8 - Lead Engineer',
    startSalary: 100000,
    maxSalary: 135000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'G5 - Junior Developer',
    startSalary: 50000,
    maxSalary: 70000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'G7 - HR Manager',
    startSalary: 75000,
    maxSalary: 100000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'G6 - Financial Analyst',
    startSalary: 65000,
    maxSalary: 90000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'G8 - Sales Manager',
    startSalary: 90000,
    maxSalary: 150000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'G5 - Marketing Specialist',
    startSalary: 55000,
    maxSalary: 75000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'G9 - Operations Director',
    startSalary: 120000,
    maxSalary: 180000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'G6 - Customer Support Manager',
    startSalary: 60000,
    maxSalary: 85000,
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
    createdAtAm: '2024-01-01T00:00:00Z',
    modifiedAtAm: '2024-01-01T00:00:00Z',
    rowVersion: '1',
    isDeleted: false
  }
];

// Helper function to extract department from job grade name
const extractDepartmentFromGrade = (gradeName: string): string => {
  const lowerName = gradeName.toLowerCase();
  if (lowerName.includes('software') || lowerName.includes('developer')) return 'IT';
  if (lowerName.includes('hr') || lowerName.includes('manager')) return 'HR';
  if (lowerName.includes('financial') || lowerName.includes('analyst')) return 'Finance';
  if (lowerName.includes('sales')) return 'Sales';
  if (lowerName.includes('marketing')) return 'Marketing';
  if (lowerName.includes('engineer')) return 'Engineering';
  if (lowerName.includes('operations')) return 'Operations';
  if (lowerName.includes('customer')) return 'Customer Service';
  return 'General';
};

// Helper function to extract position from job grade name
const extractPositionFromGrade = (gradeName: string): string => {
  const parts = gradeName.split(' - ');
  return parts.length > 1 ? parts[1] : gradeName;
};

// Helper function to calculate mid salary
const calculateMidSalary = (startSalary: number, maxSalary: number): number => {
  return Math.round((startSalary + maxSalary) / 2);
};

// Convert JobGradeListDto to the format expected by the modal
const convertToModalFormat = (grades: JobGradeListDto[]) => {
  return grades.map(grade => ({
    id: grade.id,
    grade: grade.name.split(' - ')[0], // Extract grade code (e.g., "G7")
    title: extractPositionFromGrade(grade.name),
    experience: getExperienceFromGrade(grade.name),
    roles: getRolesFromGrade(grade.name),
    salary: {
      min: `$${grade.startSalary.toLocaleString()}`,
      mid: `$${calculateMidSalary(grade.startSalary, grade.maxSalary).toLocaleString()}`,
      max: `$${grade.maxSalary.toLocaleString()}`
    },
    skill: getSkillLevelFromGrade(grade.name),
    department: extractDepartmentFromGrade(grade.name)
  }));
};

// Helper functions for conversion
const getExperienceFromGrade = (gradeName: string): string => {
  const gradeCode = gradeName.split(' - ')[0];
  switch (gradeCode) {
    case 'G5': return '0-4 years';
    case 'G6': return '3-6 years';
    case 'G7': return '5-8 years';
    case 'G8': return '8+ years';
    case 'G9': return '10+ years';
    default: return 'Varies';
  }
};

const getRolesFromGrade = (gradeName: string): string[] => {
  const position = extractPositionFromGrade(gradeName).toLowerCase();
  
  if (position.includes('senior') && position.includes('developer')) {
    return [
      'Lead development teams and architect solutions',
      'Mentor junior developers and conduct code reviews',
      'Design and implement scalable systems',
      'Collaborate with product managers on requirements'
    ];
  }
  
  if (position.includes('software developer')) {
    return [
      'Develop and maintain software applications',
      'Write clean, efficient, and well-documented code',
      'Participate in agile development processes',
      'Debug and fix software defects'
    ];
  }
  
  if (position.includes('manager')) {
    return [
      'Lead team and set performance targets',
      'Develop strategies and operational plans',
      'Manage budgets and resources',
      'Handle team development and performance reviews'
    ];
  }
  
  return [
    'Execute assigned tasks and responsibilities',
    'Participate in team meetings and planning',
    'Contribute to departmental goals',
    'Maintain professional development'
  ];
};

const getSkillLevelFromGrade = (gradeName: string): string => {
  const gradeCode = gradeName.split(' - ')[0];
  switch (gradeCode) {
    case 'G5': return 'Beginner';
    case 'G6': return 'Intermediate';
    case 'G7': return 'Advanced';
    case 'G8': 
    case 'G9': return 'Expert';
    default: return 'Varies';
  }
};

function PagePayroll() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessPayrollModalOpen, setIsProcessPayrollModalOpen] = useState(false);
  const [jobGrades] = useState<JobGradeListDto[]>(sampleJobGrades);
  const [convertedJobGrades] = useState(() => convertToModalFormat(sampleJobGrades));
  
  // Sample payroll data with job grades
  const [payrollData, setPayrollData] = useState<PayrollItem[]>([
    { id: 1, employeeId: 'EMP-001', name: 'John Smith', department: 'IT', position: 'Senior Software Developer', salary: 95000, benefits: 12000, deductions: 15000, netPay: 92000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440001', jobGradeName: 'G7 - Senior Software Developer' },
    { id: 2, employeeId: 'EMP-002', name: 'Sarah Johnson', department: 'HR', position: 'HR Manager', salary: 85000, benefits: 10000, deductions: 14000, netPay: 81000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440005', jobGradeName: 'G7 - HR Manager' },
    { id: 3, employeeId: 'EMP-003', name: 'Michael Chen', department: 'Finance', position: 'Financial Analyst', salary: 75000, benefits: 9000, deductions: 12500, netPay: 71500, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440006', jobGradeName: 'G6 - Financial Analyst' },
    { id: 4, employeeId: 'EMP-004', name: 'Emily Davis', department: 'Sales', position: 'Sales Manager', salary: 110000, benefits: 15000, deductions: 18000, netPay: 107000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440007', jobGradeName: 'G8 - Sales Manager' },
    { id: 5, employeeId: 'EMP-005', name: 'Robert Wilson', department: 'Operations', position: 'Operations Director', salary: 140000, benefits: 20000, deductions: 22000, netPay: 138000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440009', jobGradeName: 'G9 - Operations Director' },
    { id: 6, employeeId: 'EMP-006', name: 'Lisa Brown', department: 'Marketing', position: 'Marketing Specialist', salary: 65000, benefits: 8000, deductions: 11500, netPay: 61500, status: 'On Leave', lastPayDate: '2024-01-31', nextPayDate: '2024-03-01', jobGradeId: '550e8400-e29b-41d4-a716-446655440008', jobGradeName: 'G5 - Marketing Specialist' },
    { id: 7, employeeId: 'EMP-007', name: 'David Miller', department: 'Engineering', position: 'Lead Engineer', salary: 115000, benefits: 14000, deductions: 17000, netPay: 112000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440003', jobGradeName: 'G8 - Lead Engineer' },
    { id: 8, employeeId: 'EMP-008', name: 'Jessica Taylor', department: 'IT', position: 'Software Developer', salary: 82000, benefits: 9500, deductions: 13500, netPay: 78000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440002', jobGradeName: 'G6 - Software Developer' },
    { id: 9, employeeId: 'EMP-009', name: 'Thomas Anderson', department: 'Finance', position: 'Junior Accountant', salary: 60000, benefits: 7500, deductions: 10500, netPay: 57000, status: 'Pending', lastPayDate: '2024-01-15', nextPayDate: '2024-02-01', jobGradeId: '550e8400-e29b-41d4-a716-446655440004', jobGradeName: 'G5 - Junior Developer' },
    { id: 10, employeeId: 'EMP-010', name: 'Amanda Rodriguez', department: 'Sales', position: 'Account Executive', salary: 88000, benefits: 13000, deductions: 16000, netPay: 85000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440006', jobGradeName: 'G6 - Financial Analyst' },
    { id: 11, employeeId: 'EMP-011', name: 'James Wilson', department: 'Customer Service', position: 'Customer Support Manager', salary: 70000, benefits: 8500, deductions: 12500, netPay: 66000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440010', jobGradeName: 'G6 - Customer Support Manager' },
    { id: 12, employeeId: 'EMP-012', name: 'Maria Garcia', department: 'IT', position: 'Junior Developer', salary: 60000, benefits: 7000, deductions: 10000, netPay: 57000, status: 'Active', lastPayDate: '2024-01-31', nextPayDate: '2024-02-15', jobGradeId: '550e8400-e29b-41d4-a716-446655440004', jobGradeName: 'G5 - Junior Developer' },
  ]);

  // Filter data based on search term and filters
  const filteredPayroll = payrollData.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.jobGradeName && employee.jobGradeName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = filterDepartment === 'All' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Extract unique departments for filter
  const departments = ['All', ...Array.from(new Set(payrollData.map(emp => emp.department)))];
  
  // Extract unique statuses for filter
  const statuses = ['All', 'Active', 'On Leave', 'Pending', 'Terminated'];

  // Handler functions
  const handleViewDetails = (item: PayrollItem) => {
    console.log('View employee details:', item);
  };

  const handleEdit = (item: PayrollItem) => {
    console.log('Edit employee:', item);
    // Implement edit logic
  };

  const handleProcessPayrollIndividual = (item: PayrollItem) => {
    console.log('Process payroll for:', item);
    // Implement payroll processing logic 
  };

  const handleGeneratePayslip = (item: PayrollItem) => {
    console.log('Generate payslip for:', item);
    // Implement payslip generation logic
  };

  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleProcessPayrollBulk = () => {
    setIsProcessPayrollModalOpen(true);
  };

  const handleProcessPayrollSubmit = async (payrollData: any) => {
    console.log('Processing payroll with data:', payrollData);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update employee last pay dates
        const updatedPayroll = payrollData.map((emp: PayrollItem) => {
          if (payrollData.employeeIds.includes(emp.id.toString())) {
            return {
              ...emp,
              lastPayDate: payrollData.payDate,
              nextPayDate: calculateNextPayDate(new Date(payrollData.payDate))
            };
          }
          return emp;
        });
        
        setPayrollData(updatedPayroll);
        
        resolve({ 
          data: { 
            message: 'Payroll processed successfully!', 
            processedCount: payrollData.employeeIds.length,
            totalAmount: payrollData.totalAmount
          } 
        });
      }, 2000);
    });
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

  const handleAddNewEmployee = async (employeeData: any) => {
    console.log('Adding new employee:', employeeData);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the selected job grade
        const selectedGrade = jobGrades.find(g => g.id === employeeData.employmentInfo.jobGradeId);
        
        // Calculate benefits and deductions based on grade and selections
        const baseSalary = Number(employeeData.compensation.baseSalary) || 0;
        const benefits = calculateBenefitsValue(employeeData.benefits, baseSalary);
        const deductions = calculateDeductions(employeeData, baseSalary);
        const netPay = baseSalary + benefits - deductions;
        
        const newEmployee: PayrollItem = {
          id: payrollData.length + 1,
          employeeId: employeeData.employmentInfo.employeeId,
          name: `${employeeData.personalInfo.firstName} ${employeeData.personalInfo.lastName}`,
          department: employeeData.employmentInfo.department,
          position: employeeData.employmentInfo.position,
          salary: baseSalary,
          benefits: benefits,
          deductions: deductions,
          netPay: netPay,
          status: employeeData.employmentInfo.employmentStatus.charAt(0).toUpperCase() + 
                 employeeData.employmentInfo.employmentStatus.slice(1),
          lastPayDate: 'N/A',
          nextPayDate: calculateNextPayDate(),
          jobGradeId: selectedGrade?.id,
          jobGradeName: selectedGrade?.name
        };
        
        // Add the new employee to the state
        setPayrollData(prev => [newEmployee, ...prev]);
        
        resolve({ 
          data: { 
            message: 'Employee added successfully!', 
            employee: newEmployee,
            jobGrade: selectedGrade 
          } 
        });
      }, 1500);
    });
  };

  // Helper functions
  const calculateBenefitsValue = (benefits: any, baseSalary: number) => {
    let total = 0;
    
    // Health insurance (typically 5-10% of salary)
    if (benefits.healthInsurance) total += baseSalary * 0.08;
    
    // Dental insurance
    if (benefits.dentalInsurance) total += 1500;
    
    // Vision insurance
    if (benefits.visionInsurance) total += 500;
    
    // Retirement match
    if (benefits.retirementPlan && benefits.retirementMatch) {
      total += baseSalary * (Number(benefits.retirementMatch) / 100);
    }
    
    return Math.round(total);
  };

  const calculateDeductions = (employeeData: any, baseSalary: number) => {
    let total = 0;
    
    // Standard tax deductions (estimated)
    total += baseSalary * 0.22;
    total += baseSalary * 0.06;   total += baseSalary * 0.0765; 
    // Additional withholding
    if (employeeData.taxInfo.additionalWithholding) {
      total += Number(employeeData.taxInfo.additionalWithholding) * 12; // Convert monthly to annual
    }
    
    return Math.round(total);
  };

  const calculateNextPayDate = (fromDate?: Date) => {
    const today = fromDate || new Date();
    const nextPay = new Date(today);
    
    // Set to next 15th or last day of month
    if (today.getDate() < 15) {
      nextPay.setDate(15);
    } else {
      nextPay.setMonth(today.getMonth() + 1);
      nextPay.setDate(0);
    }
    
    return nextPay.toISOString().split('T')[0];
  };

  // Calculate payroll statistics
  const calculatePayrollStats = () => {
    const activeEmployees = payrollData.filter(emp => emp.status === 'Active').length;
    const totalMonthlyPayroll = payrollData.reduce((sum, emp) => sum + (emp.netPay / 12), 0);
    const averageSalary = payrollData.reduce((sum, emp) => sum + emp.salary, 0) / payrollData.length;
    const pendingPayments = payrollData.filter(emp => emp.status === 'Pending').length;
    
    return {
      activeEmployees,
      totalMonthlyPayroll: Math.round(totalMonthlyPayroll),
      averageSalary: Math.round(averageSalary),
      pendingPayments
    };
  };

  const stats = calculatePayrollStats();

  // Get job grade summary for legend
  const getJobGradeSummary = () => {
    const gradeCounts: Record<string, number> = {};
    const gradeSalaries: Record<string, { total: number, count: number }> = {};
    
    payrollData.forEach(emp => {
      if (emp.jobGradeName) {
        const gradeCode = emp.jobGradeName.split(' - ')[0];
        gradeCounts[gradeCode] = (gradeCounts[gradeCode] || 0) + 1;
        
        if (!gradeSalaries[gradeCode]) {
          gradeSalaries[gradeCode] = { total: 0, count: 0 };
        }
        gradeSalaries[gradeCode].total += emp.salary;
        gradeSalaries[gradeCode].count += 1;
      }
    });
    
    return { gradeCounts, gradeSalaries };
  };

  const { gradeCounts, gradeSalaries } = getJobGradeSummary();

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
        departments={departments}
        statuses={statuses}
        onProcessPayroll={handleProcessPayrollBulk}
        onAddEmployee={handleAddEmployee}
        onExport={handleExport}
      />

      {/* Add Employee Modal */}
      <AddPayrollModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddNewEmployee}
        jobGrades={jobGrades}
        convertedJobGrades={convertedJobGrades}
      />

      {/* Process Payroll Modal */}
      <ProcessPayrollModal
        isOpen={isProcessPayrollModalOpen}
        onClose={() => setIsProcessPayrollModalOpen(false)}
        onProcessPayroll={handleProcessPayrollSubmit}
        employees={payrollData}
      />

      <PayrollTable
        data={filteredPayroll}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredPayroll.length / 10)}
        totalItems={filteredPayroll.length}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onProcessPayroll={handleProcessPayrollIndividual}
        onGeneratePayslip={handleGeneratePayslip}
      />

      {/* Job Grade Analysis */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Job Grade Analysis</CardTitle>
          <CardDescription>Current distribution and salary analysis by job grade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Distribution by Grade */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Employee Distribution by Grade</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(gradeCounts).map(([grade, count]) => {
                  const totalEmployees = payrollData.length;
                  const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                  const avgSalary = gradeSalaries[grade] 
                    ? Math.round(gradeSalaries[grade].total / gradeSalaries[grade].count)
                    : 0;
                  
                  const getGradeColor = (grade: string) => {
                    switch (grade) {
                      case 'G5': return 'bg-gray-100 border-gray-300';
                      case 'G6': return 'bg-blue-50 border-blue-200';
                      case 'G7': return 'bg-indigo-50 border-indigo-200';
                      case 'G8': return 'bg-purple-50 border-purple-200';
                      case 'G9': return 'bg-emerald-50 border-emerald-200';
                      default: return 'bg-gray-50 border-gray-200';
                    }
                  };
                  
                  return (
                    <div key={grade} className={`p-4 rounded-lg border ${getGradeColor(grade)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{grade}</span>
                        <span className="text-sm font-medium text-gray-700">{count} employees</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>{percentage}% of workforce</span>
                        <span>Avg: ${avgSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Grade Legend */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Job Grade Legend</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-gray-900">G5</div>
                  <div className="text-sm text-gray-600">Entry Level</div>
                  <div className="text-xs text-gray-500">0-4 years experience</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-gray-900">G6</div>
                  <div className="text-sm text-gray-600">Intermediate</div>
                  <div className="text-xs text-gray-500">3-6 years experience</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="font-bold text-gray-900">G7</div>
                  <div className="text-sm text-gray-600">Senior</div>
                  <div className="text-xs text-gray-500">5-8 years experience</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="font-bold text-gray-900">G8</div>
                  <div className="text-sm text-gray-600">Lead</div>
                                    <div className="text-xs text-gray-500">8+ years experience</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="font-bold text-gray-900">G9</div>
                  <div className="text-sm text-gray-600">Director</div>
                  <div className="text-xs text-gray-500">10+ years experience</div>
                </div>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="px-3 py-2 bg-gray-100 rounded-lg">
                  <span className="text-gray-600">Total Employees: </span>
                  <span className="font-medium text-gray-900">{payrollData.length}</span>
                </div>
                <div className="px-3 py-2 bg-blue-100 rounded-lg">
                  <span className="text-gray-600">Avg Base Salary: </span>
                  <span className="font-medium text-gray-900">${Math.round(payrollData.reduce((sum, emp) => sum + emp.salary, 0) / payrollData.length).toLocaleString()}</span>
                </div>
                <div className="px-3 py-2 bg-green-100 rounded-lg">
                  <span className="text-gray-600">Avg Net Pay: </span>
                  <span className="font-medium text-gray-900">${Math.round(payrollData.reduce((sum, emp) => sum + emp.netPay, 0) / payrollData.length).toLocaleString()}</span>
                </div>
                <div className="px-3 py-2 bg-purple-100 rounded-lg">
                  <span className="text-gray-600">Total Monthly Payroll: </span>
                  <span className="font-medium text-gray-900">${stats.totalMonthlyPayroll.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PagePayroll;