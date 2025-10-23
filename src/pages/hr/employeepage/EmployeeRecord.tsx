import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EmployeeManagementHeader from '../../../components/hr/employee/EmployeeManagementHeader';
import EmployeeStatsCards from '../../../components/hr/employee/EmployeeStatsCards';
import EmployeeSearchFilters from '../../../components/hr/employee/EmployeeSearchFilters';
import EmployeeTable from '../../../components/hr/employee/EmployeeTable';
import type { EmployeeListDto } from '../../../types/hr/employee';
import { initialEmployees } from '../../../data/hr/employee';
import type { UUID } from '../../../types/hr/employee';

// Extended type for local state management
type EmployeeWithStatus = EmployeeListDto & {
  status?: "active" | "on-leave";
};

const EmployeeManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employmentType: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [employees, setEmployees] = useState<EmployeeWithStatus[]>(initialEmployees);

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

  const handleAddEmployee = (newEmployee: Omit<EmployeeListDto, 'id'>) => {
    const employeeWithId: EmployeeWithStatus = {
      ...newEmployee,
      id: `emp-${Date.now()}` as UUID,
      // Ensure all required fields are present
      personId: newEmployee.personId || `person-${Date.now()}` as UUID,
      jobGradeId: newEmployee.jobGradeId || 'grade-1' as UUID,
      positionId: newEmployee.positionId || 'position-1' as UUID,
      departmentId: newEmployee.departmentId || 'dept-1' as UUID,
      employmentTypeId: newEmployee.employmentTypeId || 'type-1' as UUID,
      employmentNatureId: newEmployee.employmentNatureId || 'nature-1' as UUID,
      gender: newEmployee.gender || '0',
      nationality: newEmployee.nationality || 'Ethiopian',
      code: newEmployee.code || `EMP${Date.now().toString().slice(-6)}`,
      employmentDate: newEmployee.employmentDate || new Date().toISOString().split('T')[0],
      jobGrade: newEmployee.jobGrade || 'G1',
      position: newEmployee.position || 'Employee',
      department: newEmployee.department || 'General',
      employmentType: newEmployee.employmentType || 'Full-time',
      employmentNature: newEmployee.employmentNature || 'Permanent',
      genderStr: newEmployee.genderStr || 'Male',
      empFullName: newEmployee.empFullName || 'New Employee',
      empFullNameAm: newEmployee.empFullNameAm || 'አዲስ ሰራተኛ',
      employmentDateStr: newEmployee.employmentDateStr || new Date().toLocaleDateString(),
      employmentDateStrAm: newEmployee.employmentDateStrAm || new Date().toLocaleDateString(),
      status: 'active' as "active" | "on-leave",
      createdAt: newEmployee.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: newEmployee.updatedBy || 'System'
    };
    
    setEmployees(prev => [employeeWithId, ...prev]); // Add to beginning of list
    setCurrentPage(1); // Reset to first page to see the new employee
    
    // Show success message or notification
    console.log('New employee added:', employeeWithId);
  };

  const handleEmployeeUpdate = (updatedEmployee: EmployeeWithStatus) => {
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
    const searchLower = searchTerm.toLowerCase();
    
    // Search through available fields
    const matchesSearch = 
      employee.empFullName.toLowerCase().includes(searchLower) ||
      employee.empFullNameAm.toLowerCase().includes(searchLower) ||
      employee.code.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.employmentType.toLowerCase().includes(searchLower) ||
      employee.nationality.toLowerCase().includes(searchLower);
    
    const matchesDepartment = filters.department ? employee.department === filters.department : true;
    const matchesStatus = filters.status ? employee.status === filters.status : true;
    const matchesEmploymentType = filters.employmentType ? employee.employmentType === filters.employmentType : true;

    return matchesSearch && matchesDepartment && matchesStatus && matchesEmploymentType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats based on current data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "active").length;
  const onLeaveEmployees = employees.filter(e => e.status === "on-leave").length;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="w-full mx-auto">
        <div className="flex flex-col space-y-6">
          <EmployeeManagementHeader />
          
          <EmployeeStatsCards 
            totalEmployees={totalEmployees}
            activeEmployees={activeEmployees}
            onLeaveEmployees={onLeaveEmployees}
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