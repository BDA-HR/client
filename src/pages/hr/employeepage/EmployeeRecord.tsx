import { useState } from 'react';
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
  const itemsPerPage = 10;
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employeeWithId = {
      ...newEmployee,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [...prev, employeeWithId]);
    setCurrentPage(1);
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

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
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
      className="p-4 md:p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
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
  onAddEmployee={handleAddEmployee}
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