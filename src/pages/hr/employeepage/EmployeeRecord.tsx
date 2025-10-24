import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EmployeeManagementHeader from '../../../components/hr/employee/EmployeeManagementHeader';
import EmployeeStatsCards from '../../../components/hr/employee/EmployeeStatsCards';
import EmployeeSearchFilters from '../../../components/hr/employee/EmployeeSearchFilters';
import EmployeeTable from '../../../components/hr/employee/EmployeeTable';
import type { EmployeeListDto } from '../../../types/hr/employee';
import { initialEmployees } from '../../../data/hr/employee';

// Extended type for local state management
type EmployeeWithStatus = EmployeeListDto & {
  status?: "active" | "on-leave";
};

const EmployeeManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [employees, setEmployees] = useState<EmployeeWithStatus[]>(initialEmployees);
  const [previousStats, setPreviousStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0
  });

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

  // Store current stats as previous stats when component mounts or data changes
  useEffect(() => {
    const currentTotal = employees.length;
    const currentActive = employees.filter(e => e.status === "active").length;
    const currentOnLeave = employees.filter(e => e.status === "on-leave").length;

    // Only update previous stats if we have actual data to prevent showing changes on initial load
    if (currentTotal > 0 && previousStats.total === 0) {
      setPreviousStats({
        total: currentTotal,
        active: currentActive,
        onLeave: currentOnLeave
      });
    }
  }, [employees]);

  const handleAddEmployee = (newEmployee: EmployeeWithStatus) => {
    // Update previous stats before adding new employee
    setPreviousStats({
      total: employees.length,
      active: employees.filter(e => e.status === "active").length,
      onLeave: employees.filter(e => e.status === "on-leave").length
    });
    
    setEmployees(prev => [newEmployee, ...prev]);
    setCurrentPage(1);
    
    console.log('New employee added:', newEmployee);
  };

  const handleEmployeeUpdate = (updatedEmployee: EmployeeWithStatus) => {
    // Update previous stats before making changes
    setPreviousStats({
      total: employees.length,
      active: employees.filter(e => e.status === "active").length,
      onLeave: employees.filter(e => e.status === "on-leave").length
    });

    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleEmployeeStatusChange = (employeeId: string, newStatus: "active" | "on-leave") => {
    // Update previous stats before making changes
    setPreviousStats({
      total: employees.length,
      active: employees.filter(e => e.status === "active").length,
      onLeave: employees.filter(e => e.status === "on-leave").length
    });

    setEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId ? { 
          ...emp, 
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0]
        } : emp
      )
    );
  };

  const handleEmployeeTerminate = (employeeId: string) => {
    // Update previous stats before making changes
    setPreviousStats({
      total: employees.length,
      active: employees.filter(e => e.status === "active").length,
      onLeave: employees.filter(e => e.status === "on-leave").length
    });

    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      setLoading(false);
      // Update previous stats on refresh
      setPreviousStats({
        total: employees.length,
        active: employees.filter(e => e.status === "active").length,
        onLeave: employees.filter(e => e.status === "on-leave").length
      });
      console.log('Data refreshed');
    }, 1000);
  };

  // Filter employees based on search only
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

    return matchesSearch;
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
            previousTotal={previousStats.total}
            previousActive={previousStats.active}
            previousOnLeave={previousStats.onLeave}
          />

          <EmployeeSearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={{ department: '', status: '', employmentType: '' }} // Empty filters
            setFilters={() => {}} // Empty function
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