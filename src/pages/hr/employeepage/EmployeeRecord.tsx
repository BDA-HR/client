import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EmployeeManagementHeader from '../../../components/hr/employee/EmployeeManagementHeader';
import EmployeeStatsCards from '../../../components/hr/employee/EmployeeStatsCards';
import EmployeeSearchFilters from '../../../components/hr/employee/EmployeeSearchFilters';
import EmployeeTable from '../../../components/hr/employee/EmployeeTable';
import type { Employee } from '../../../types/employee';
import { initialEmployees } from '../../../data/employee';

const EmployeeManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    contractType: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Check for new employee data when component mounts or when returning from add employee page
  useEffect(() => {
    const checkForNewEmployee = () => {
      const newEmployeeData = sessionStorage.getItem('newEmployee');
      if (newEmployeeData) {
        try {
          const newEmployee = JSON.parse(newEmployeeData);
          handleAddEmployee(newEmployee);
          // Clear the stored data
          sessionStorage.removeItem('newEmployee');
        } catch (error) {
          console.error('Error parsing new employee data:', error);
        }
      }
    };

    checkForNewEmployee();

    // Also check when page becomes visible (user returns from add employee page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForNewEmployee();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employeeWithId: Employee = {
      ...newEmployee,
      id: `emp-${Date.now()}`,
      // Ensure all required fields are present
      employeeId: newEmployee.employeeId || `EMP${Date.now().toString().slice(-6)}`,
      middleName: newEmployee.middleName || '',
      city: newEmployee.city || '',
      state: newEmployee.state || '',
      postalCode: newEmployee.postalCode || '',
      country: newEmployee.country || '',
      dateOfBirth: newEmployee.dateOfBirth || '',
      gender: newEmployee.gender || '',
      maritalStatus: newEmployee.maritalStatus || '',
      emergencyContact: newEmployee.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      },
      jobGrade: newEmployee.jobGrade || '',
      employeeCategory: newEmployee.employeeCategory || '',
      reportingTo: newEmployee.reportingTo || '',
      manager: newEmployee.manager || '',
      team: newEmployee.team || '',
      workLocation: newEmployee.workLocation || '',
      workSchedule: newEmployee.workSchedule || '',
      currency: newEmployee.currency || 'USD',
      paymentMethod: newEmployee.paymentMethod || '',
      bankDetails: newEmployee.bankDetails || {
        bankName: '',
        accountNumber: '',
        branchCode: ''
      },
      taxInformation: newEmployee.taxInformation || '',
      totalLeavesTaken: newEmployee.totalLeavesTaken || 0,
      leaveBalance: newEmployee.leaveBalance || 0,
      attendancePercentage: newEmployee.attendancePercentage || 100,
      performanceRating: newEmployee.performanceRating || 0,
      lastAppraisalDate: newEmployee.lastAppraisalDate || '',
      nextAppraisalDate: newEmployee.nextAppraisalDate || '',
      keyPerformanceIndicators: newEmployee.keyPerformanceIndicators || [],
      skills: newEmployee.skills || [],
      competencies: newEmployee.competencies || [],
      trainings: newEmployee.trainings || [],
      previousRoles: newEmployee.previousRoles || [],
      documents: newEmployee.documents || [],
      createdAt: newEmployee.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: newEmployee.updatedBy || 'System'
    };
    
    setEmployees(prev => [employeeWithId, ...prev]); // Add to beginning of list
    setCurrentPage(1); // Reset to first page to see the new employee
    
    // Show success message or notification
    console.log('New employee added:', employeeWithId);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleEmployeeStatusChange = (employeeId: string, newStatus: "active" | "on-leave") => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      )
    );
  };

  const handleEmployeeTerminate = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      setLoading(false);
      // In a real app, you would fetch fresh data from the API
      console.log('Data refreshed');
    }, 1000);
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filters.department ? employee.department === filters.department : true;
    const matchesStatus = filters.status ? employee.status === filters.status : true;
    const matchesContract = filters.contractType ? employee.contractType === filters.contractType : true;

    return matchesSearch && matchesDepartment && matchesStatus && matchesContract;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 bg-gray-50 min-h-screen p-4"
    >
      <div className="w-full mx-auto">
        <div className="flex flex-col space-y-6">
          <EmployeeManagementHeader />
          
          <EmployeeStatsCards 
            totalEmployees={employees.length}
            activeEmployees={employees.filter(e => e.status === "active").length}
            onLeaveEmployees={employees.filter(e => e.status === "on-leave").length}
          />

          <EmployeeSearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            employees={employees}
            onRefresh={handleRefresh}
            loading={loading}
          />

          <EmployeeTable 
            employees={paginatedEmployees}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEmployees.length}
            onPageChange={setCurrentPage}
            onEmployeeUpdate={handleEmployeeUpdate}
            onEmployeeStatusChange={handleEmployeeStatusChange}
            onEmployeeTerminate={handleEmployeeTerminate}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  }
};

export default EmployeeManagementPage;